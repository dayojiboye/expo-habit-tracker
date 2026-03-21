import { IconName } from "react-native-remix-icon";

export interface Habit {
	name: string;
	daysCompleted: Date[];
	icon: IconName;
	description: string;
}
