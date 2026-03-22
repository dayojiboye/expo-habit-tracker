import { IconName } from "react-native-remix-icon";

export interface Habit {
  name: string;
  daysCompleted: string[];
  icon: IconName;
  description: string;
}
