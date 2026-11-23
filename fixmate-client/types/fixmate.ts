export type UserRole = 'customer' | 'technician' | 'admin';

export type ServiceCategory =
  | 'Smartphone'
  | 'Laptop & PC'
  | 'AC'
  | 'Refrigerator'
  | 'TV'
  | 'Washing Machine'
  | 'Electrical';

export type ServiceMode = 'Home Visit' | 'Shop Drop-off';

export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  area?: string;
  bio?: string;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
}

export interface ServiceItem {
  _id: string;
  title: string;
  category: ServiceCategory | string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode | string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  isAvailable?: boolean;
  createdAt?: string;
}

export interface BookingItem {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status:
    | 'requested'
    | 'accepted'
    | 'rejected'
    | 'in-progress'
    | 'completed'
    | 'cancelled';
  finalAmount: number;
  paymentStatus: 'unpaid' | 'paid';
  createdAt?: string;
}

export interface PaymentItem {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: 'paid';
  paidAt: string;
}