import { getDaysInAWeek } from "@/utils/helpers";
import { format, isBefore, isToday, startOfDay } from "date-fns";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { ScrollView, Text } from "react-native";
import { cn } from "tailwind-variants";

export function DaysView() {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className="grow-0 mt-6"
			contentContainerClassName="gap-x-1.5 px-4"
		>
			{getDaysInAWeek().map((date) => (
				<PressableFeedback
					key={date}
					className={cn("items-center justify-center rounded-[18px] p-2 bg-ht-ghost w-13 h-16", {
						"bg-ht-green": isBefore(date, startOfDay(new Date())),
						"bg-black": isToday(date),
					})}
					style={{ borderCurve: "continuous" }}
				>
					<Text
						className={cn("text-sm font-ob-semibold text-foreground text-center leading-tight", {
							"text-white": isToday(date),
						})}
					>
						{format(date, "dd")}
					</Text>
					<Text
						className={cn("text-sm font-ob-regular text-foreground text-center leading-tight", {
							"text-white": isToday(date),
						})}
					>
						{format(date, "EE")}
					</Text>
				</PressableFeedback>
			))}
		</ScrollView>
	);
}
