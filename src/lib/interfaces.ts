export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: string; // DECIMAL
  rating: string; // DECIMAL
  categories: string[];
  images: string[];
  supplierId: string;
  maxGroupSize: number;
  duration: number; // HOURS
  includedItems: string[];
  excludedItems: string[];
  itinerary: string; // JSON Parsable
  meetingPoint: string;
  endingPoint: string;
  minAge: number | null;
  languages: string[];
  cancellationPolicy: string;
  b2bAvailable: boolean;
  b2bMinQuantity: number | null;
  b2bDiscount: number | null;
  bulkAvailability: number;
  reviews: string[];
  availability: Availability[];
  workingHours: WorkingHours[];
}

export interface Availability {
  date: Date;
  isBooked: boolean;
  productId: string;
  price: string; // DECIMAL
  availableSpots: number;
}

export interface WorkingHours {
  dayOfWeek: DayOfWeek;
  startTime: string; // FORMAT: HH:mm
  endTime: string; // FORMAT: HH:mm
  productId: string;
  isAvailable: boolean;
}

export interface SupplierDashboard {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  totalCompletedOrders: number;
  totalPendingOrders: number;
  totalCancelledOrders: number;
  recentOrders: Order[];
  salesComparison: SalesComparison;
}

export interface Order {
  id: string;
  productName: string;
  customerName: string;
  date: Date;
  status: BookingStatus;
  totalPrice: number;
}

export interface SalesComparison {
  currentMonthSales: number;
  previousMonthSales: number;
  percentageChange: number; // Positive or negative value representing the percentage change
  monthlySales: MonthlyDataPoint[];
}

export interface MonthlyDataPoint {
  month: string;
  sales: number;
  orders: number;
}

export enum BookingStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  CONFIRMED = "CONFIRMED",
}

enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}
