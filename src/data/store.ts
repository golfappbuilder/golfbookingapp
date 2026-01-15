import { User, Course, Booking } from '../models';

// In-memory data store for demonstration purposes
// In production, this would be replaced with a database

class DataStore {
  private users: Map<string, User> = new Map();
  private courses: Map<string, Course> = new Map();
  private bookings: Map<string, Booking> = new Map();

  // User methods
  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  saveUser(user: User): void {
    this.users.set(user.id, user);
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Course methods
  getCourses(): Course[] {
    return Array.from(this.courses.values());
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.get(id);
  }

  saveCourse(course: Course): void {
    this.courses.set(course.id, course);
  }

  deleteCourse(id: string): boolean {
    return this.courses.delete(id);
  }

  // Booking methods
  getBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  getBookingByConfirmation(confirmationNumber: string): Booking | undefined {
    return Array.from(this.bookings.values()).find(
      b => b.confirmationNumber === confirmationNumber
    );
  }

  getBookingsByUserId(userId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(b => b.userId === userId);
  }

  getBookingsByCourseId(courseId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(b => b.courseId === courseId);
  }

  getBookingsByDate(courseId: string, date: string): Booking[] {
    return Array.from(this.bookings.values()).filter(
      b => b.courseId === courseId && b.date === date && b.status !== 'cancelled'
    );
  }

  saveBooking(booking: Booking): void {
    this.bookings.set(booking.id, booking);
  }

  deleteBooking(id: string): boolean {
    return this.bookings.delete(id);
  }

  // Get bookings that need reminder emails (booking is tomorrow)
  getBookingsNeedingReminder(targetDate: string): Booking[] {
    return Array.from(this.bookings.values()).filter(
      b => b.date === targetDate &&
           b.status === 'confirmed' &&
           !b.reminderSent
    );
  }
}

// Singleton instance
export const dataStore = new DataStore();
