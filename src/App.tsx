import React, { useState } from "react";
import DateRangePicker from "./components/DateRangePicker/DateRangePicker";

const App: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<
    [string | null, string | null]
  >([null, null]);
  const [weekends, setWeekends] = useState<string[]>([]);

  const handleDateChange = (
    selectedRange: [string | null, string | null],
    weekends: string[]
  ) => {
    setSelectedRange(selectedRange);
    setWeekends(weekends);
  };

  // Helper function to calculate date ranges
  const getLastMonth = (): [Date, Date] => {
    const now = new Date();
    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Day 0 gives the last day of the previous month
    return [firstDayLastMonth, lastDayLastMonth];
  };

  const getLastWeek = (): [Date, Date] => {
    const now = new Date();
    const startOfLastWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() - 6
    ); // Previous Sunday - 6 days
    const endOfLastWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    ); // Previous Sunday
    return [startOfLastWeek, endOfLastWeek];
  };

  const getNextWeek = (): [Date, Date] => {
    const now = new Date();
    const startOfNextWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (7 - now.getDay()) + 1
    ); // Next Monday
    const endOfNextWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (7 - now.getDay()) + 7
    ); // Next Sunday
    return [startOfNextWeek, endOfNextWeek];
  };

  const getNextMonth = (): [Date, Date] => {
    const now = new Date();
    const firstDayNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    const lastDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0); // Day 0 gives the last day of the current month + 1
    return [firstDayNextMonth, lastDayNextMonth];
  };

  const predefinedRanges: { label: string; range: [Date, Date] }[] = [
    {
      label: "Previous Year",
      range: [
        new Date(new Date().getFullYear() - 1, 0, 1), // January 1st of last year
        new Date(new Date().getFullYear() - 1, 11, 31), // December 31st of last year
      ] as [Date, Date],
    },
    {
      label: "Previous Month",
      range: getLastMonth(),
    },
    {
      label: "Previous Week",
      range: getLastWeek(),
    },
    {
      label: "Yesterday",
      range: [
        new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
        new Date(new Date().setDate(new Date().getDate() - 1)),
      ] as [Date, Date],
    },
    {
      label: "Today",
      range: [new Date(), new Date()] as [Date, Date], // Today
    },
    {
      label: "Tomorrow",
      range: [
        new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
        new Date(new Date().setDate(new Date().getDate() + 1)),
      ] as [Date, Date],
    },
    {
      label: "Next Week",
      range: getNextWeek(),
    },
    {
      label: "Next Month",
      range: getNextMonth(),
    },
    {
      label: "Next Year",
      range: [
        new Date(new Date().getFullYear() + 1, 0, 1), // January 1st of next year
        new Date(new Date().getFullYear() + 1, 11, 31), // December 31st of next year
      ] as [Date, Date],
    },
  ];

  return (
    <div>
      <h1>Date Range Picker</h1>
      <DateRangePicker
        onChange={handleDateChange}
        predefinedRanges={predefinedRanges}
      />

      {selectedRange[0] && selectedRange[1] && (
        <div style={{ marginTop: "20px" }}>
          <h3>Selected Date Range</h3>
          <p>
            From: {selectedRange[0]} To: {selectedRange[1]}
          </p>
          {weekends.length > 0 && (
            <div>
              <h4>Weekend Dates:</h4>
              <ul>
                {weekends.map((weekend, index) => (
                  <li key={index}>{weekend}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
