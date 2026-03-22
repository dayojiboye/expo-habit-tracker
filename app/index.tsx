import { DaysView } from "@/components/days-view";
import { HabitCard } from "@/components/habit-card";
import { HabitModal } from "@/components/habit-modal";
import { STORED_HABITS } from "@/constants/core";
import { Habit } from "@/types/habit";
import * as SecureStore from "expo-secure-store";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Icon from "react-native-remix-icon";
import { useCSSVariable } from "uniwind";

const COLOR_VARS = [
  "--color-ht-yellow",
  "--color-ht-green",
  "--color-ht-orange",
  "--color-ht-light-blue",
  "--color-ht-pink",
  "--color-ht-teal",
];

export default function HomeScreen() {
  const colors = useCSSVariable(COLOR_VARS) as string[];
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  function retrieveHabits() {
    let storedHabits = SecureStore.getItem(STORED_HABITS);
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    } else {
      console.log("No values stored under this key.");
    }
  }

  useEffect(() => {
    retrieveHabits();
  }, []);

  return (
    <View className="flex-1 pt-safe bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow pt-6 pb-[50px]"
      >
        <View className="px-4">
          <Text className="text-3xl text-foreground font-ob-bold">Habits</Text>
        </View>

        {habits.length === 0 ? (
          <View className="h-[200px] items-center justify-center px-4">
            <Text className="text-center font-ob-regular text-muted text-base leading-relaxed">
              Every journey starts somewhere. Add your first habit now. Tap + to
              create one.
            </Text>
          </View>
        ) : (
          <>
            <DaysView />

            <View className="flex-row flex-wrap gap-1.5 px-4 mt-6">
              {habits.map((habit, index) => (
                <HabitCard
                  key={habit.name}
                  name={habit.name}
                  description={habit.description}
                  icon={habit.icon}
                  isCompleted={false}
                  color={colors?.[index % colors.length] ?? "#f7cd63"}
                  onPress={() => setHabitToEdit(habit)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <PressableFeedback
        className="bg-ht-blue absolute right-6 bottom-safe rounded-2xl items-center justify-center size-13 shadow-md"
        style={{ borderCurve: "continuous" }}
        onPress={() => setShowHabitModal(true)}
      >
        <Icon name="add-fill" color={"#fff"} size={26} />
      </PressableFeedback>

      <HabitModal
        isVisible={showHabitModal || !!habitToEdit}
        habits={habits}
        habit={habitToEdit}
        setHabits={setHabits}
        onClose={() => {
          setShowHabitModal(false);
          setHabitToEdit(null);
        }}
      />
    </View>
  );
}
