"use client";
import { createContext, useContext } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ value, children }) {
  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
