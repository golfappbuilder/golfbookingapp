import { v4 as uuidv4 } from 'uuid';
import { Course, CreateCourseDTO, TeeTime } from '../models';
import { dataStore } from '../data/store';

export class CourseService {
  getAllCourses(): Course[] {
    return dataStore.getCourses();
  }

  getCourseById(id: string): Course | null {
    return dataStore.getCourseById(id) || null;
  }

  createCourse(dto: CreateCourseDTO): Course {
    const course: Course = {
      id: uuidv4(),
      name: dto.name,
      description: dto.description,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
      phone: dto.phone,
      email: dto.email,
      holes: dto.holes || 18,
      par: dto.par || 72,
      yardage: dto.yardage || 6500,
      greenFee: dto.greenFee,
      cartFee: dto.cartFee || 20,
      openTime: dto.openTime || '06:00',
      closeTime: dto.closeTime || '19:00',
      teeTimeInterval: dto.teeTimeInterval || 10,
      maxPlayersPerGroup: dto.maxPlayersPerGroup || 4,
      amenities: dto.amenities || [],
      imageUrl: dto.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dataStore.saveCourse(course);
    return course;
  }

  updateCourse(id: string, dto: Partial<CreateCourseDTO>): Course | null {
    const course = dataStore.getCourseById(id);
    if (!course) {
      return null;
    }

    const updatedCourse: Course = {
      ...course,
      ...dto,
      updatedAt: new Date(),
    };

    dataStore.saveCourse(updatedCourse);
    return updatedCourse;
  }

  deleteCourse(id: string): boolean {
    return dataStore.deleteCourse(id);
  }

  getAvailableTeeTimes(courseId: string, date: string): TeeTime[] {
    const course = dataStore.getCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const existingBookings = dataStore.getBookingsByDate(courseId, date);
    const teeTimes: TeeTime[] = [];

    const [openHour, openMin] = course.openTime.split(':').map(Number);
    const [closeHour, closeMin] = course.closeTime.split(':').map(Number);

    let currentTime = openHour * 60 + openMin;
    const endTime = closeHour * 60 + closeMin;

    while (currentTime < endTime) {
      const hours = Math.floor(currentTime / 60);
      const mins = currentTime % 60;
      const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

      // Check existing bookings for this time
      const bookingsAtTime = existingBookings.filter(b => b.teeTime === timeStr);
      const bookedSlots = bookingsAtTime.reduce((sum, b) => sum + b.numberOfPlayers, 0);
      const availableSlots = course.maxPlayersPerGroup - bookedSlots;

      teeTimes.push({
        time: timeStr,
        available: availableSlots > 0,
        availableSlots: Math.max(0, availableSlots),
        price: course.greenFee,
      });

      currentTime += course.teeTimeInterval;
    }

    return teeTimes;
  }
}

export const courseService = new CourseService();
