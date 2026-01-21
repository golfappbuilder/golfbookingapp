export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  handicap?: number | null;
  membershipType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  holes: number;
  par: number;
  yardage: number;
  greenFee: number;
  cartFee: number;
  openTime: string;
  closeTime: string;
  teeTimeInterval: number;
  maxPlayersPerGroup: number;
  amenities: string;
  imageUrl?: string | null;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  courseId: string;
  userId: string;
  date: string;
  teeTime: string;
  numberOfPlayers: number;
  playerNames: string;
  includeCart: boolean;
  totalPrice: number;
  status: string;
  confirmationNumber: string;
  notes?: string | null;
  emailNotificationSent: boolean;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  course?: Course;
  user?: User;
}

export interface TeeTime {
  time: string;
  available: boolean;
  availableSlots: number;
  price: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Review {
  id: string;
  courseId: string;
  reviewerName: string;
  datePlayed: string;
  ratings: {
    conditions: number;
    paceOfPlay: number;
    value: number;
    overall: number;
  };
  whatWorked: string;
  whatDidntWork: string;
  createdAt: string;
}
