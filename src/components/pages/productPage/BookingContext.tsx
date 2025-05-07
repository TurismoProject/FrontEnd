import React, { createContext, useContext, useState } from "react";
import { Availability } from "@/lib/interfaces";

// Define the context shape
interface BookingContextType {
  selectedDateTime: Date | null;
  setSelectedDateTime: (date: Date | null) => void;
  getAvailableSpots: (availability: Availability[]) => number | null;
}

// Create the context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider component
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  // Function to get available spots for the selected date/time
  const getAvailableSpots = (availability: Availability[]): number | null => {
    if (!selectedDateTime) return null;
    const slot = availability.find((a) => {
      const availDate = new Date(a.date);
      return (
        availDate.getFullYear() === selectedDateTime.getFullYear() &&
        availDate.getMonth() === selectedDateTime.getMonth() &&
        availDate.getDate() === selectedDateTime.getDate() &&
        availDate.getHours() === selectedDateTime.getHours() &&
        availDate.getMinutes() === selectedDateTime.getMinutes()
      );
    });
    return slot ? slot.availableSpots : null;
  };

  return (
    <BookingContext.Provider
      value={{ selectedDateTime, setSelectedDateTime, getAvailableSpots }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Hook for easy usage
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
