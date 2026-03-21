import { Habit } from "@/types/habit";
import { Checkbox, cn, useThemeColor } from "heroui-native";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { Text, View } from "react-native";
import Icon from "react-native-remix-icon";

type HabitCardProps = { isCompleted: boolean; color: string } & Omit<Habit, "daysCompleted">;

export function HabitCard({ name, description, icon, isCompleted, color }: HabitCardProps) {
	const mutedColor = useThemeColor("muted");

	return (
		<PressableFeedback
			className="w-[49%] min-h-[110px] rounded-[16px] p-3"
			style={{ borderCurve: "continuous", backgroundColor: isCompleted ? "#f2f2f3" : color }}
		>
			<View className="flex-row items-start justify-between">
				<Icon name={icon} size={26} color={isCompleted ? mutedColor : "#000"} />
				<Checkbox
					isSelected={isCompleted}
					className="size-5 rounded-full border-[1.5px] border-black bg-transparent"
				>
					{({ isSelected }) => (
						<Checkbox.Indicator className={cn({ "bg-black": isSelected })}>
							<Icon name="check-fill" color="#fff" size={16} />
						</Checkbox.Indicator>
					)}
				</Checkbox>
			</View>

			<View className="mt-auto">
				<Text
					className={cn("font-ob-medium text-sm text-foreground", { "text-muted": isCompleted })}
				>
					{name}
				</Text>
				<Text
					className={cn("font-ob-regular text-xs text-foreground", { "text-muted": isCompleted })}
				>
					{description}
				</Text>
			</View>
		</PressableFeedback>
	);
}
