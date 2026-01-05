import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function BookingCalendar({ selectedDate, setSelectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);

  // Compute the week starting from the selected date
  useEffect(() => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1); 
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWeekDates(dates);
  }, [selectedDate]);

  // Calendar grid generation
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const firstDayIndex = firstDay.getDay();
    const days = [];

    // Previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false });
    }

    // Current month
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true, isToday: date.toDateString() === today.toDateString() });
    }

    // Next month
    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(currentDate);
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Navigate months
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Check if date is in selected week
  const isInSelectedWeek = (date) => {
    return weekDates.some((d) => d.toDateString() === date.toDateString());
  };

  return (
    <div className=" rounded-xl shadow-sm border border-border-color p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Find Next Available Time</h2>
        <FaCalendarAlt className="h-5 w-5 text-gray-500" />
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition duration-200">
          <FaChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800">{currentMonth} {currentYear}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition duration-200">
          <FaChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">{day}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isSelected = isInSelectedWeek(day.date);
          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day.date)}
              className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                ${day.isToday ? "bg-blue-100 text-blue-900" : ""}
                ${isSelected ? "bg-primary text-white" : "hover:bg-gray-100"}
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
