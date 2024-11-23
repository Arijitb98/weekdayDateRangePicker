import React, { useState } from "react";
import Calendar from "./Calender";
import { formatDate, getWeekendsInRange } from "./utils";
import PredefinedRanges from "./PredefinedRanges";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangePickerProps {
  onChange: (
    selectedRange: [string | null, string | null],
    weekends: string[]
  ) => void;
  predefinedRanges?: { label: string; range: [Date, Date] }[];
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  predefinedRanges,
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [range, setRange] = useState<DateRange>({ from: null, to: null });

  // Function to check if the date is a weekday (Monday to Friday)
  const isWeekday = (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Exclude Saturday (6) and Sunday (0)
  };

  const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Function to handle date selection
  const handleDateSelect = (selectedDate: Date) => {
    const normalizedSelectedDate = normalizeDate(selectedDate);
    if (!isWeekday(normalizedSelectedDate)) return;

    if (range.from && range.to) {
      setRange({ from: normalizedSelectedDate, to: null });
    } else if (range.from) {
      const updatedRange = {
        from: normalizeDate(range.from),
        to: normalizedSelectedDate,
      };
      if (updatedRange.to < updatedRange.from) {
        updatedRange.from = normalizedSelectedDate;
        updatedRange.to = normalizeDate(range.from);
      }
      setRange(updatedRange);

      const weekends = getWeekendsInRange(updatedRange.from, updatedRange.to!);
      onChange(
        [formatDate(updatedRange.from), formatDate(updatedRange.to)],
        weekends.map(formatDate)
      );
    } else {
      setRange({ from: normalizedSelectedDate, to: null });
    }
  };

  // Function to handle predefined range selection
  const handlePredefinedRangeClick = (selectedRange: [Date, Date]) => {
    const normalizedRange = {
      from: normalizeDate(selectedRange[0]),
      to: normalizeDate(selectedRange[1]),
    };

    setRange(normalizedRange);

    const weekends = getWeekendsInRange(
      normalizedRange.from,
      normalizedRange.to
    );
    onChange(
      [formatDate(normalizedRange.from), formatDate(normalizedRange.to)],
      weekends.map(formatDate)
    );
  };

  // Function to handle month navigation
  const handleMonthChange = (offset: number) => {
    const newMonth = currentMonth + offset;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  // Function to handle year navigation
  const handleYearChange = (offset: number) => {
    setCurrentYear(currentYear + offset);
  };

  // Clear selection function
  const clearSelection = () => {
    setRange({ from: null, to: null });
    onChange([null, null], []);
  };

  return (
    <div className="date-range-picker">
      <Calendar
        year={currentYear}
        month={currentMonth}
        range={{
          from: range.from ? normalizeDate(range.from) : null,
          to: range.to ? normalizeDate(range.to) : null,
        }}
        onDayClick={handleDateSelect}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      <button onClick={clearSelection} className="clear-selection-btn">
        Clear Selection
      </button>
      {predefinedRanges && (
        <PredefinedRanges
          predefinedRanges={predefinedRanges}
          onRangeClick={handlePredefinedRangeClick}
        />
      )}
    </div>
  );
};

export default DateRangePicker;
