"use client";

import React, { createContext, useContext, useState } from "react";
import { Availability } from "@/lib/interfaces";

// Define the context shape
interface BookingContextType {
  selectedDateTime: Date | null;
  setSelectedDateTime: (date: Date | null) => void;
  getAvailableSpots: (availability: Availability[]) => number | null;
  adultsCount: number;
  setAdultsCount: (count: number) => void;
  childrenCount: number;
  setChildrenCount: (count: number) => void;
  totalGuests: number;
}

// Create the context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider component
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State for selected date/time
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [adultsCount, setAdultsCount] = useState<number>(1);
  const [childrenCount, setChildrenCount] = useState<number>(0);

  const totalGuests = adultsCount + childrenCount;

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
      value={{
        selectedDateTime,
        setSelectedDateTime,
        getAvailableSpots,
        adultsCount,
        setAdultsCount,
        childrenCount,
        setChildrenCount,
        totalGuests,
      }}
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
