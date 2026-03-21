import { DaysView } from "@/components/days-view";
import { HabitCard } from "@/components/habit-card";
import { mockHabits } from "@/constants/mock-habits";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { ScrollView, Text, View } from "react-native";
import Icon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function HomeScreen() {
	return (
		<StyledSafeAreaView className="flex-1 bg-background">
			<ScrollView className="flex-1" contentContainerClassName="flex-1 pt-6 pb-[50px]">
				<View className="px-4">
					<Text className="text-3xl text-foreground font-ob-bold">Habits</Text>
				</View>

				<DaysView />

				<View className="flex-row flex-wrap gap-1.5 px-4 mt-6">
					{mockHabits.map((habit) => (
						<HabitCard
							key={habit.name}
							name={habit.name}
							description={habit.description}
							icon={habit.icon}
							isCompleted={true}
						/>
					))}
				</View>
			</ScrollView>

			<PressableFeedback
				className="bg-ht-blue absolute right-6 bottom-safe rounded-2xl items-center justify-center size-13 shadow-md"
				style={{ borderCurve: "continuous" }}
			>
				<Icon name="add-fill" color={"#fff"} size={26} />
			</PressableFeedback>
		</StyledSafeAreaView>
	);
}
