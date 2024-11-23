import React from "react";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface CalendarProps {
  year: number;
  month: number;
  range: DateRange;
  onDayClick: (selectedDate: Date) => void;
  onMonthChange: (offset: number) => void;
  onYearChange: (offset: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  range,
  onDayClick,
  onMonthChange,
  onYearChange,
}) => {
  // Utility function to normalize date for comparison
  const toDateKey = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Get the first and last days of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Get the previous month's last day and the next month's first day
  const prevMonthLastDay = new Date(year, month, 0);

  // Get the days in the month
  const daysInMonth = [];
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(year, month, i));
  }

  // Get the weekday of the first day of the month (0 = Sunday, 6 = Saturday)
  const startDayOfWeek = firstDayOfMonth.getDay();

  // Calculate the number of empty cells before the first day of the month
  const prevMonthDays = [];
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(
      new Date(year, month - 1, prevMonthLastDay.getDate() - i)
    );
  }

  // Calculate the number of empty cells after the last day of the month
  const nextMonthDays = [];
  const totalDaysInGrid = prevMonthDays.length + daysInMonth.length;
  const remainingDays = 42 - totalDaysInGrid;
  for (let i = 1; i <= remainingDays; i++) {
    nextMonthDays.push(new Date(year, month + 1, i));
  }

  // Combine all the days for the calendar grid
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

  const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const isInRange = (date: Date) => {
    if (!range.from || !range.to) return false;
    const dateKey = toDateKey(date);
    return (
      dateKey >= toDateKey(normalizeDate(range.from)) &&
      dateKey <= toDateKey(normalizeDate(range.to))
    );
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => onYearChange(-1)}>&lt;&lt; Previous Year</button>
        <button onClick={() => onMonthChange(-1)}>&lt; Previous Month</button>
        <span>{`${year}-${month + 1}`}</span>
        <button onClick={() => onMonthChange(1)}>Next Month &gt;</button>
        <button onClick={() => onYearChange(1)}>Next Year &gt;&gt;</button>
      </div>
      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-name">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {allDays.map((date) => {
          const isSelected =
            (range.from && toDateKey(range.from) === toDateKey(date)) ||
            (range.to && toDateKey(range.to) === toDateKey(date));

          const isWeekendDay = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
          const isWithinRange = isInRange(date);

          return (
            <div
              key={toDateKey(date)}
              className={`calendar-day 
                ${isWeekendDay ? "disabled" : ""} 
                ${isSelected ? "selected" : ""} 
                ${isWithinRange && !isSelected ? "in-range" : ""}`}
              onClick={() => !isWeekendDay && onDayClick(date)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
