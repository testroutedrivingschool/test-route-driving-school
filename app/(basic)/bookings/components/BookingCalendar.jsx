/* eslint-disable react-hooks/set-state-in-effect */
import React, {useState, useEffect} from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function BookingCalendar({selectedDate, setSelectedDate, disablePastDates= false}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setHours(0, 0, 0, 0);

    const day = startOfWeek.getDay();
    const diffToMonday = (day + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push(d);
    }
    setWeekDates(dates);
  }, [selectedDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = (firstDay.getDay() + 6) % 7;

    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = firstDayIndex; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false,
      });
    }

    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        isCurrentMonth: true,
        isToday: d.toDateString() === today.toDateString(),
      });
    }

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
const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  return checkDate < today;
};
  const isInSelectedWeek = (date) =>
    weekDates.some((d) => d.toDateString() === date.toDateString());

 const handleSelectDate = (date) => {
  if (disablePastDates && isPastDate(date)) return;

  setSelectedDate(date);
  setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
};

  const goToMonth = (date) => {
    setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const renderMonth = (monthDate) => {
    const calendarDays = getDaysInMonth(monthDate);
    const currentMonth = months[monthDate.getMonth()];
    const currentYear = monthDate.getFullYear();

    const prevMonthDate = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() - 1,
      1,
    );
    const nextMonthDate = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      1,
    );

    return (
      <div className="border border-black bg-white ">
        {/* Month Header */}
        <div className="flex justify-between items-center px-2 md:px-2 py-1 md:py-2 border-b border-border-color ">
          <button
            onClick={() => goToMonth(prevMonthDate)}
            className="justify-self-start text-[10px] md:text-xs  text-gray-500 font-semibold border border-gray-400 px-1 py-1 leading-none hover:bg-gray-100 transition"
          >
            {months[prevMonthDate.getMonth()].slice(0, 3)}
          </button>

          <h3 className="text-center text-sm  font-bold text-black">
            {currentMonth} {currentYear}
          </h3>

          <button
            onClick={() => goToMonth(nextMonthDate)}
            className="justify-self-end text-[10px] md:text-xs  text-gray-500 font-semibold border border-gray-400 px-2 py-1 leading-none hover:bg-gray-100 transition"
          >
            {months[nextMonthDate.getMonth()].slice(0, 3)}
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 bg-secondary">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-xs md:text-[15px] font-bold text-white py-0.5 "
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
  const inWeek = isInSelectedWeek(day.date);
  const isDisabled = disablePastDates && isPastDate(day.date);

  return (
    <button
      key={index}
      onClick={() => handleSelectDate(day.date)}
      disabled={isDisabled}
      className={`py-0 flex items-center justify-center text-[10px] md:text-sm transition
        ${day.isCurrentMonth ? "text-black" : "text-gray-400"}
        ${inWeek ? "bg-primary text-white" : "hover:bg-gray-100"}
        ${!inWeek && day.isToday ? "bg-secondary text-white " : ""}
        ${isDisabled ? "opacity-40 cursor-not-allowed " : ""}
      `}
    >
      {day.date.getDate()}
    </button>
  );
})}
        </div>
      </div>
    );
  };

  const nextMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1,
  );

  return (
    <section className="px-[18%] md:px-0">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="bg-primary rounded-lg px-4 py-1 md:py-2 text-center">
          <h2 className="text-[11px] md:text-base font-bold text-white">
            Find Next Available Time
          </h2>
        </div>

        {/* gap below header */}
        <div className="mt-1.5  md:mt-5 space-y-0">
          {/* Mobile */}
          <div className="block md:hidden">
            {renderMonth(currentDate)}
          </div>

          {/* Desktop */}
          <div className="hidden md:grid md:grid-cols-1 gap-6">
            {renderMonth(currentDate)}
            {renderMonth(nextMonthDate)}
          </div>
        </div>
      </div>
    </section>
  );
}