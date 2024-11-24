import React, { useState } from "react";
import DateRangePicker from "./components/DateRangePicker/DateRangePicker";
import { predefinedRanges } from "./components/DateRangePicker/utils";

const App: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<
    [string | null, string | null]
  >([null, null]);
  const [weekends, setWeekends] = useState<string[]>([]);
  const [weekendSelected, setWeekendSelected] = useState<boolean>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    from: "",
    to: "",
    range: "",
  });

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

  const validateDate = (date: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date) && !isNaN(new Date(date).getTime());
  };

  const isWeekend = (value: string): boolean => {
    if (value.length !== 10) return false; // Ensure full date format is present (YYYY-MM-DD)
    const parsedDate = new Date(value);
    if (isNaN(parsedDate.getTime())) return false; // Check if valid date
    const day = parsedDate.getDay();
    return day === 0 || day === 6; // Sunday (0) or Saturday (6)
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    // Add hyphens at the appropriate positions for the YYYY-MM-DD format
    if (value.length > 4) {
      value = value.substring(0, 4) + "-" + value.substring(4);
    }
    if (value.length > 7) {
      value = value.substring(0, 7) + "-" + value.substring(7);
    }

    // Limit the length to YYYY-MM-DD format (10 characters max)
    value = value.slice(0, 10);

    // Create a new range array with the updated value
    const newSelectedRange = [...selectedRange] as [
      string | null,
      string | null
    ];
    newSelectedRange[index] = value;
    setSelectedRange(newSelectedRange);

    // Validate the current input (checking date format and weekend status)
    const isValidDate = value.length === 10 && validateDate(value); // Full length, valid format
    const newErrors = { ...errors };

    // Handle errors based on the input index (from or to)
    if (index === 0) {
      if (value.length === 10 && isValidDate) {
        if (isWeekend(value)) {
          newErrors.from = "Weekends are not allowed.";
          setWeekendSelected(true);
        } else {
          newErrors.from = "";
          setWeekendSelected(false);
        }
      } else {
        setWeekends([]);
        newErrors.from = "Enter a valid date";
      }
    } else {
      if (value.length === 10 && isValidDate) {
        if (isWeekend(value)) {
          newErrors.to = "Weekends are not allowed.";
          setWeekendSelected(true);
        } else {
          newErrors.to = "";
          setWeekendSelected(false);
        }
      } else {
        newErrors.to = "Enter a valid date";
        setWeekends([]);
      }
    }

    // Update errors state with the modified errors
    setErrors(newErrors);

    // If both dates are valid, update weekends
    if (newSelectedRange[0] && newSelectedRange[1]) {
      const fromDate = new Date(newSelectedRange[0]);
      const toDate = new Date(newSelectedRange[1]);

      if (fromDate <= toDate) {
        setWeekends(getWeekendDates(fromDate, toDate));
        newErrors.range = "";
      } else {
        newErrors.range = "To date cannot be earlier than From date.";
      }
      setErrors(newErrors);
    }
  };

  const handleDateChange = (
    selectedRange: [string | null, string | null],
    weekends: string[]
  ) => {
    setWeekendSelected(false);

    const [from, to] = selectedRange;
    const newErrors = { ...errors };

    newErrors.to = "";
    newErrors.from = "";
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (fromDate > toDate) {
        newErrors.range = "To date cannot be earlier than From date.";
        setErrors(newErrors);
        return;
      } else {
        setErrors({ ...newErrors, range: "" });
        setWeekends(weekends);
      }
    } else {
      setWeekends([]);
    }
    setSelectedRange(selectedRange);
  };

  const fromIsValid = selectedRange[0] && !errors.from;
  const toIsValid = selectedRange[1] && !errors.to;

  const isValidRange =
    !!(fromIsValid || toIsValid) && !errors.range && !weekendSelected;

  return (
    <div>
      <h1>Date Range Picker</h1>
      <DateRangePicker
        onChange={handleDateChange}
        predefinedRanges={predefinedRanges}
        selectedRange={selectedRange}
        isValidRange={isValidRange}
      />

      <div style={{ marginTop: "20px" }}>
        <div className="date-range-section">
          <h3 className="date-range-heading">Selected Date Range</h3>
          <div className="date-range-form">
            <div className="date-range-field">
              <label htmlFor="fromDate" className="date-range-label">
                From:
              </label>
              <input
                id="fromDate"
                type="text"
                value={selectedRange[0] || ""}
                onChange={(e) => handleInputChange(e, 0)}
                placeholder="YYYY-MM-DD"
                className={`date-range-input ${
                  errors.from ? "input-error" : ""
                }`}
              />
              {errors.from && (
                <span className="error-message">{errors.from}</span>
              )}
            </div>

            <div className="date-range-field">
              <label htmlFor="toDate" className="date-range-label">
                To:
              </label>
              <input
                id="toDate"
                type="text"
                value={selectedRange[1] || ""}
                onChange={(e) => handleInputChange(e, 1)}
                placeholder="YYYY-MM-DD"
                className={`date-range-input ${errors.to ? "input-error" : ""}`}
              />
              {errors.to && <span className="error-message">{errors.to}</span>}
            </div>
          </div>

          {errors.range && <div className="range-error">{errors.range}</div>}
        </div>

        {weekends.length > 0 && !weekendSelected && (
          <div>
            <h4>Weekend Dates:</h4>
            <div className="weekend-dates-container">
              <table className="weekend-dates-table">
                <thead>
                  <tr>
                    <th>Saturday</th>
                    <th>Sunday</th>
                  </tr>
                </thead>
                <tbody>
                  {weekends.length > 0 &&
                    weekends
                      .reduce<string[][]>((acc, weekend, index) => {
                        if (index % 2 === 0) {
                          acc.push([weekend]);
                        } else {
                          acc[acc.length - 1].push(weekend);
                        }
                        return acc;
                      }, [])
                      .map((weekendPair, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="saturday">{weekendPair[0]}</td>
                          <td className="sunday">{weekendPair[1] || ""}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
