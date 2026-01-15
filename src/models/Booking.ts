export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface Booking {
  id: string;
  courseId: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  teeTime: string; // HH:MM format
  numberOfPlayers: number;
  playerNames: string[];
  includeCart: boolean;
  totalPrice: number;
  status: BookingStatus;
  confirmationNumber: string;
  notes?: string;
  emailNotificationSent: boolean;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingDTO {
  courseId: string;
  userId: string;
  date: string;
  teeTime: string;
  numberOfPlayers: number;
  playerNames?: string[];
  includeCart?: boolean;
  notes?: string;
}

export interface UpdateBookingDTO {
  date?: string;
  teeTime?: string;
  numberOfPlayers?: number;
  playerNames?: string[];
  includeCart?: boolean;
  notes?: string;
  status?: BookingStatus;
}

export interface BookingWithDetails extends Booking {
  courseName: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
}
