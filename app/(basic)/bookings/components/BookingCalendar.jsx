/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ✅ Monday → Sunday
const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function BookingCalendar({ selectedDate, setSelectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);

  // ✅ Build week (Mon → Sun) from selectedDate
  useEffect(() => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setHours(0, 0, 0, 0);

    const day = startOfWeek.getDay();       // Sun=0..Sat=6
    const diffToMonday = (day + 6) % 7;     // Mon=0..Sun=6
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push(d);
    }
    setWeekDates(dates);
  }, [selectedDate]);

  // ✅ Calendar grid (Mon-first)
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Mon-first index
    const firstDayIndex = (firstDay.getDay() + 6) % 7;

    const days = [];

    // previous month fillers
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false,
      });
    }

    // current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        isCurrentMonth: true,
        isToday: d.toDateString() === today.toDateString(),
      });
    }

    // next month fillers (42 total)
    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(currentDate);
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Navigate months
  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // ✅ Week highlight check
  const isInSelectedWeek = (date) =>
    weekDates.some((d) => d.toDateString() === date.toDateString());

  // ✅ When selecting a date, also move month view to that date’s month
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  return (
    <div className="rounded-xl shadow-sm border border-border-color">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 py-4 rounded-t-xl text-center bg-primary">
        <h2 className="text-base font-bold text-white">Find Next Available Time</h2>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition duration-200">
          <FaChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {currentMonth} {currentYear}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition duration-200">
          <FaChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Weekday Headers (Mon → Sun) */}
      <div className="grid grid-cols-7 gap-1 mb-2 bg-secondary px-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-white py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 px-1 pb-2">
        {calendarDays.map((day, index) => {
          const inWeek = isInSelectedWeek(day.date);

          return (
            <button
              key={index}
              onClick={() => handleSelectDate(day.date)}
              className={`py-1 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                ${inWeek ? "bg-primary text-white" : "hover:bg-gray-100"}
                ${!inWeek && day.isToday ? "bg-blue-100 text-blue-900" : ""}
              `}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
