import { eachDayOfInterval, format, subDays } from "date-fns";

export function getLast7Days(dateFormat = "yyyy-MM-dd") {
  const today = new Date();
  const start = subDays(today, 6);

  return eachDayOfInterval({ start, end: today }).map((date) => format(date, dateFormat));
}
