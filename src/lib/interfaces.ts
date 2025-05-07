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

enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}
