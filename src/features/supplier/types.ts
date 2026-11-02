export type DepartureStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
export type AttendanceStatus = "NOT_RECORDED" | "BOARDED" | "NO_SHOW";

export interface Supplier {
  id: string;
  name: string;
  email: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Metrics {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  pendingParticipants: number;
  confirmedParticipants: number;
  boardedParticipants: number;
  noShowParticipants: number;
  unrecordedParticipants: number;
}

export interface Departure {
  id: string;
  productId: string;
  product: { id: string; name: string; supplierId: string };
  startsAt: string;
  timeZone: string;
  capacity: number;
  pricePerPerson: string;
  status: DepartureStatus;
  metrics: Metrics;
  availableSeats: number;
  acceptsReservations: boolean;
}

export interface Participant {
  id: string;
  name: string;
  attendance: AttendanceStatus;
}

export interface Reservation {
  id: string;
  responsibleName: string;
  status: ReservationStatus;
  totalPrice: string;
  createdAt: string;
  cancellationReason: string | null;
  participants: Participant[];
}

export interface Dashboard {
  from: string;
  to: string;
  totals: Metrics & {
    departures: number;
    completedDepartures: number;
    cancelledDepartures: number;
    completedParticipants: number;
  };
  byDateAndProduct: {
    date: string;
    productId: string;
    productName: string;
    totals: Dashboard["totals"];
  }[];
}

export interface ReservationEvent {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  createdAt: string;
  details: {
    reason?: string | null;
    attendance?: AttendanceStatus;
    participantCount?: number;
    participantIds?: string[];
  };
}
