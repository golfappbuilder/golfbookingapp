import { v4 as uuidv4 } from 'uuid';
import { Booking, CreateBookingDTO, UpdateBookingDTO, BookingWithDetails } from '../models';
import { dataStore } from '../data/store';
import { courseService } from './CourseService';
import { userService } from './UserService';
import { emailService } from './EmailService';

export class BookingService {
  private generateConfirmationNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'GB-'; // Golf Booking prefix
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  getAllBookings(): Booking[] {
    return dataStore.getBookings();
  }

  getBookingById(id: string): Booking | null {
    return dataStore.getBookingById(id) || null;
  }

  getBookingByConfirmation(confirmationNumber: string): Booking | null {
    return dataStore.getBookingByConfirmation(confirmationNumber) || null;
  }

  getBookingsByUserId(userId: string): Booking[] {
    return dataStore.getBookingsByUserId(userId);
  }

  getBookingsByCourseAndDate(courseId: string, date: string): Booking[] {
    return dataStore.getBookingsByDate(courseId, date);
  }

  getBookingWithDetails(id: string): BookingWithDetails | null {
    const booking = dataStore.getBookingById(id);
    if (!booking) {
      return null;
    }

    const course = courseService.getCourseById(booking.courseId);
    const user = userService.getUserById(booking.userId);

    if (!course || !user) {
      return null;
    }

    return {
      ...booking,
      courseName: course.name,
      userEmail: user.email,
      userFirstName: user.firstName,
      userLastName: user.lastName,
    };
  }

  async createBooking(dto: CreateBookingDTO): Promise<Booking> {
    // Validate course exists
    const course = courseService.getCourseById(dto.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Validate user exists
    const user = userService.getUserById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate number of players
    if (dto.numberOfPlayers < 1 || dto.numberOfPlayers > course.maxPlayersPerGroup) {
      throw new Error(`Number of players must be between 1 and ${course.maxPlayersPerGroup}`);
    }

    // Check availability
    const existingBookings = dataStore.getBookingsByDate(dto.courseId, dto.date);
    const bookingsAtTime = existingBookings.filter(b => b.teeTime === dto.teeTime);
    const bookedSlots = bookingsAtTime.reduce((sum, b) => sum + b.numberOfPlayers, 0);

    if (bookedSlots + dto.numberOfPlayers > course.maxPlayersPerGroup) {
      throw new Error('Not enough available slots for this tee time');
    }

    // Calculate total price
    const greenFees = course.greenFee * dto.numberOfPlayers;
    const cartFees = dto.includeCart ? course.cartFee * Math.ceil(dto.numberOfPlayers / 2) : 0;
    const totalPrice = greenFees + cartFees;

    const booking: Booking = {
      id: uuidv4(),
      courseId: dto.courseId,
      userId: dto.userId,
      date: dto.date,
      teeTime: dto.teeTime,
      numberOfPlayers: dto.numberOfPlayers,
      playerNames: dto.playerNames || [],
      includeCart: dto.includeCart || false,
      totalPrice,
      status: 'confirmed',
      confirmationNumber: this.generateConfirmationNumber(),
      notes: dto.notes,
      emailNotificationSent: false,
      reminderSent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dataStore.saveBooking(booking);

    // Send confirmation email asynchronously
    this.sendBookingConfirmationEmail(booking);

    return booking;
  }

  async updateBooking(id: string, dto: UpdateBookingDTO): Promise<Booking | null> {
    const booking = dataStore.getBookingById(id);
    if (!booking) {
      return null;
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      throw new Error('Cannot modify a cancelled or completed booking');
    }

    const course = courseService.getCourseById(booking.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Recalculate price if relevant fields changed
    let totalPrice = booking.totalPrice;
    const numberOfPlayers = dto.numberOfPlayers || booking.numberOfPlayers;
    const includeCart = dto.includeCart !== undefined ? dto.includeCart : booking.includeCart;

    if (dto.numberOfPlayers !== undefined || dto.includeCart !== undefined) {
      const greenFees = course.greenFee * numberOfPlayers;
      const cartFees = includeCart ? course.cartFee * Math.ceil(numberOfPlayers / 2) : 0;
      totalPrice = greenFees + cartFees;
    }

    const updatedBooking: Booking = {
      ...booking,
      ...dto,
      totalPrice,
      updatedAt: new Date(),
    };

    dataStore.saveBooking(updatedBooking);

    // Send update notification if significant changes
    if (dto.date || dto.teeTime) {
      this.sendBookingUpdateEmail(updatedBooking);
    }

    return updatedBooking;
  }

  async cancelBooking(id: string): Promise<Booking | null> {
    const booking = dataStore.getBookingById(id);
    if (!booking) {
      return null;
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    if (booking.status === 'completed') {
      throw new Error('Cannot cancel a completed booking');
    }

    const updatedBooking: Booking = {
      ...booking,
      status: 'cancelled',
      updatedAt: new Date(),
    };

    dataStore.saveBooking(updatedBooking);

    // Send cancellation email
    this.sendBookingCancellationEmail(updatedBooking);

    return updatedBooking;
  }

  deleteBooking(id: string): boolean {
    return dataStore.deleteBooking(id);
  }

  // Email notification methods
  private async sendBookingConfirmationEmail(booking: Booking): Promise<void> {
    try {
      const bookingDetails = this.getBookingWithDetails(booking.id);
      if (!bookingDetails) {
        console.error('Could not get booking details for email');
        return;
      }

      await emailService.sendBookingConfirmation(bookingDetails);

      // Update booking to mark email as sent
      const updatedBooking: Booking = {
        ...booking,
        emailNotificationSent: true,
        updatedAt: new Date(),
      };
      dataStore.saveBooking(updatedBooking);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  }

  private async sendBookingUpdateEmail(booking: Booking): Promise<void> {
    try {
      const bookingDetails = this.getBookingWithDetails(booking.id);
      if (!bookingDetails) {
        console.error('Could not get booking details for email');
        return;
      }

      await emailService.sendBookingUpdate(bookingDetails);
    } catch (error) {
      console.error('Failed to send update email:', error);
    }
  }

  private async sendBookingCancellationEmail(booking: Booking): Promise<void> {
    try {
      const bookingDetails = this.getBookingWithDetails(booking.id);
      if (!bookingDetails) {
        console.error('Could not get booking details for email');
        return;
      }

      await emailService.sendBookingCancellation(bookingDetails);
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
    }
  }

  // Send reminder emails for bookings happening tomorrow
  async sendReminderEmails(): Promise<number> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const bookingsNeedingReminder = dataStore.getBookingsNeedingReminder(tomorrowStr);
    let sentCount = 0;

    for (const booking of bookingsNeedingReminder) {
      try {
        const bookingDetails = this.getBookingWithDetails(booking.id);
        if (bookingDetails) {
          await emailService.sendBookingReminder(bookingDetails);

          // Mark reminder as sent
          const updatedBooking: Booking = {
            ...booking,
            reminderSent: true,
            updatedAt: new Date(),
          };
          dataStore.saveBooking(updatedBooking);
          sentCount++;
        }
      } catch (error) {
        console.error(`Failed to send reminder for booking ${booking.id}:`, error);
      }
    }

    return sentCount;
  }
}

export const bookingService = new BookingService();
