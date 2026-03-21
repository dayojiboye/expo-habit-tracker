import { eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";

export function getDaysInAWeek(dateFormat = "yyyy-MM-dd") {
	const today = new Date();
	const start = startOfWeek(today, { weekStartsOn: 1 });
	const end = endOfWeek(today, { weekStartsOn: 1 });

	return eachDayOfInterval({ start, end }).map((date) => format(date, dateFormat));
}
