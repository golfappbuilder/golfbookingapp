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
  holes: 9 | 18;
  par: number;
  yardage: number;
  greenFee: number;
  cartFee: number;
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  teeTimeInterval: number; // minutes between tee times
  maxPlayersPerGroup: number;
  amenities: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseDTO {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  holes?: 9 | 18;
  par?: number;
  yardage?: number;
  greenFee: number;
  cartFee?: number;
  openTime?: string;
  closeTime?: string;
  teeTimeInterval?: number;
  maxPlayersPerGroup?: number;
  amenities?: string[];
  imageUrl?: string;
}

export interface TeeTime {
  time: string; // HH:MM format
  available: boolean;
  availableSlots: number;
  price: number;
}
