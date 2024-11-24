import React, { useState } from "react";
import DateRangePicker from "./components/DateRangePicker/DateRangePicker";

const App: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<
    [string | null, string | null]
  >([null, null]);
  const [weekends, setWeekends] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    from: "",
    to: "",
    range: "",
  });

  // Helper function to calculate weekend dates in a range
  const getWeekendDates = (startDate: Date, endDate: Date): string[] => {
    let weekends: string[] = [];
    let currentDate = new Date(startDate);

    // Loop through the date range to find Saturdays and Sundays
    while (currentDate <= endDate) {
      if (currentDate.getDay() === 6 || currentDate.getDay() === 0) {
        weekends.push(currentDate.toISOString().split("T")[0]);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return weekends;
  };

  // Helper function to validate date input
  const validateDate = (date: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Matches YYYY-MM-DD format
    return regex.test(date) && !isNaN(new Date(date).getTime()); // Check if it's a valid date
  };

  // Handle input change with auto-formatting
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    // Add hyphens at the appropriate positions
    if (value.length > 4) {
      value = value.substring(0, 4) + "-" + value.substring(4);
    }
    if (value.length > 7) {
      value = value.substring(0, 7) + "-" + value.substring(7);
    }

    // Ensure max length of YYYY-MM-DD (10 characters including hyphens)
    value = value.slice(0, 10);

    // Validate the entered date (only validate when fully typed as YYYY-MM-DD)
    const isValidDate = value.length === 10 && validateDate(value);
    const newSelectedRange = [...selectedRange] as [
      string | null,
      string | null
    ];
    newSelectedRange[index] = value;
    setSelectedRange(newSelectedRange);

    // Update errors
    const newErrors = { ...errors };
    if (index === 0) {
      newErrors.from =
        value.length === 10 && isValidDate
          ? ""
          : "Enter a valid YYYY-MM-DD date";
    } else {
      newErrors.to =
        value.length === 10 && isValidDate
          ? ""
          : "Enter a valid YYYY-MM-DD date";
    }
    setErrors(newErrors);
  };

  const handleDateChange = (
    selectedRange: [string | null, string | null],
    weekends: string[]
  ) => {
    let rangeError = "";
    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    // Only validate when both "from" and "to" dates are not null
    if (selectedRange[0]) {
      fromDate = new Date(selectedRange[0]);
    }
    if (selectedRange[1]) {
      toDate = new Date(selectedRange[1]);
    }

    // Validate if "To" date is earlier than "From" date
    if (fromDate && toDate && fromDate > toDate) {
      rangeError = "To date cannot be earlier than From date.";
    }

    // Update error states
    const newErrors = { ...errors };

    if (rangeError) {
      newErrors.range = rangeError;
    } else {
      newErrors.range = ""; // Clear range error
    }

    setErrors(newErrors);

    // Only update the selected range if no range error
    if (!rangeError) {
      setSelectedRange(selectedRange);
      // Calculate and set weekends when the range is valid
      if (fromDate && toDate) {
        const weekends = getWeekendDates(fromDate, toDate);
        setWeekends(weekends);
      }
    }
  };

  // Check if both from and to dates are valid
  const fromIsValid = selectedRange[0] && !errors.from;
  const toIsValid = selectedRange[1] && !errors.to;

  // Logic for setting the valid range
  const isValidRange = !!(fromIsValid || toIsValid) && !errors.range;

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
    );
    const endOfLastWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    return [startOfLastWeek, endOfLastWeek];
  };

  const getNextWeek = (): [Date, Date] => {
    const now = new Date();
    const startOfNextWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (7 - now.getDay()) + 1
    );
    const endOfNextWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (7 - now.getDay()) + 7
    );
    return [startOfNextWeek, endOfNextWeek];
  };

  const getNextMonth = (): [Date, Date] => {
    const now = new Date();
    const firstDayNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    const lastDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    return [firstDayNextMonth, lastDayNextMonth];
  };

  const predefinedRanges: { label: string; range: [Date, Date] }[] = [
    {
      label: "Previous Year",
      range: [
        new Date(new Date().getFullYear() - 1, 0, 1),
        new Date(new Date().getFullYear() - 1, 11, 31),
      ],
    },
    { label: "Previous Month", range: getLastMonth() },
    { label: "Previous Week", range: getLastWeek() },
    {
      label: "Yesterday",
      range: [
        new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1)),
      ],
    },
    { label: "Today", range: [new Date(), new Date()] },
    {
      label: "Tomorrow",
      range: [
        new Date(new Date().setDate(new Date().getDate() + 1)),
        new Date(new Date().setDate(new Date().getDate() + 1)),
      ],
    },
    { label: "Next Week", range: getNextWeek() },
    { label: "Next Month", range: getNextMonth() },
    {
      label: "Next Year",
      range: [
        new Date(new Date().getFullYear() + 1, 0, 1),
        new Date(new Date().getFullYear() + 1, 11, 31),
      ],
    },
  ];

  return (
    <div>
      <h1>Date Range Picker</h1>
      <DateRangePicker
        onChange={handleDateChange}
        predefinedRanges={predefinedRanges}
        selectedRange={selectedRange} // Pass selected range as prop
        isValidRange={isValidRange} // Pass validation state
      />

      {/* Date Range Inputs */}
      <div style={{ marginTop: "20px" }}>
        <h3>Selected Date Range</h3>
        <p>
          From:{" "}
          <input
            type="text"
            value={selectedRange[0] || ""}
            onChange={(e) => handleInputChange(e, 0)}
            placeholder="YYYY-MM-DD"
          />
          {errors.from && <span style={{ color: "red" }}>{errors.from}</span>}{" "}
          To:{" "}
          <input
            type="text"
            value={selectedRange[1] || ""}
            onChange={(e) => handleInputChange(e, 1)}
            placeholder="YYYY-MM-DD"
          />
          {errors.to && <span style={{ color: "red" }}>{errors.to}</span>}
        </p>

        {/* Range Error Section */}
        {errors.range && <span style={{ color: "red" }}>{errors.range}</span>}

        {/* Weekend Dates Section */}
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
    </div>
  );
};

export default App;
