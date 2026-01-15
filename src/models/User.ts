export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  handicap?: number;
  membershipType: 'guest' | 'member' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  handicap?: number;
  membershipType?: 'guest' | 'member' | 'premium';
}

export interface UpdateUserDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  handicap?: number;
  membershipType?: 'guest' | 'member' | 'premium';
}
