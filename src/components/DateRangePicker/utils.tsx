export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getWeekendsInRange = (startDate: Date, endDate: Date): Date[] => {
  const weekends: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      // Sunday or Saturday
      weekends.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weekends;
};

// Helper functions to calculate date ranges
export const getLastMonth = (): [Date, Date] => {
  const now = new Date();
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Day 0 gives the last day of the previous month
  return [firstDayLastMonth, lastDayLastMonth];
};

export const getLastWeek = (): [Date, Date] => {
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

export const getNextWeek = (): [Date, Date] => {
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

export const getNextMonth = (): [Date, Date] => {
  const now = new Date();
  const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const lastDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  return [firstDayNextMonth, lastDayNextMonth];
};

export const predefinedRanges: { label: string; range: [Date, Date] }[] = [
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
