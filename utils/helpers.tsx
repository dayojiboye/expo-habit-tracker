import { LAST_RESET_KEY, STORED_HABITS } from "@/constants/core";
import { Habit } from "@/types/habit";
import { eachDayOfInterval, format, startOfWeek, subDays } from "date-fns";
import * as SecureStore from "expo-secure-store";

export function getLast7Days(dateFormat = "yyyy-MM-dd") {
  const today = new Date();
  const start = subDays(today, 6);

  return eachDayOfInterval({ start, end: today }).map((date) => format(date, dateFormat));
}

function getWeekKey() {
  const newWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  return format(newWeek, "yyyy-MM-dd");
}

export function resetHabitsIfNewWeek(habits: Habit[]): Habit[] {
  const currentWeekKey = getWeekKey();
  const lastResetWeek = SecureStore.getItem(LAST_RESET_KEY);

  if (lastResetWeek === currentWeekKey) return habits;

  const reset = habits.map((habit) => ({ ...habit, daysCompleted: [] }));
  SecureStore.setItem(STORED_HABITS, JSON.stringify(reset));
  SecureStore.setItem(LAST_RESET_KEY, currentWeekKey);
  return reset;
}
