import { STORED_HABITS } from "@/constants/core";
import { Habit } from "@/types/habit";
import { format } from "date-fns";
import * as SecureStore from "expo-secure-store";
import { Checkbox, cn, useThemeColor } from "heroui-native";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { Text, View } from "react-native";
import Icon from "react-native-remix-icon";

type HabitCardProps = {
  habit: Habit;
  day: Date;
  color: string;
  onPress: () => void;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

export function HabitCard({ habit, day, color, onPress, habits, setHabits }: HabitCardProps) {
  const mutedColor = useThemeColor("muted");
  const formattedDay = format(day, "yyyy-MM-dd");
  const isCompleted = habit.daysCompleted.includes(formattedDay);

  function toggleCompleted() {
    const habitIndex = habits.findIndex((h) => h.name.toLowerCase() === habit.name.toLowerCase());

    if (habitIndex === -1) return;

    const updatedDaysCompleted = isCompleted
      ? habit.daysCompleted.filter((d) => d !== formattedDay)
      : [formattedDay, ...habit.daysCompleted];

    const updatedHabits = habits.map((h, i) => {
      return i === habitIndex ? { ...h, daysCompleted: updatedDaysCompleted } : h;
    });

    setHabits(updatedHabits);
    SecureStore.setItem(STORED_HABITS, JSON.stringify(updatedHabits));
  }

  return (
    <PressableFeedback
      onPress={onPress}
      className="w-[49%] min-h-[110px] rounded-[16px] p-3 gap-5"
      style={{
        borderCurve: "continuous",
        backgroundColor: isCompleted ? "#f2f2f3" : color,
      }}
    >
      <View className="flex-row items-start justify-between">
        <Icon name={habit.icon} size={26} color={isCompleted ? mutedColor : "#000"} />
        <Checkbox
          isSelected={isCompleted}
          animation="disable-all"
          onSelectedChange={() => toggleCompleted()}
          className={cn("size-5 rounded-full border-[1.5px] border-black bg-transparent", {
            "bg-black": isCompleted,
          })}
        >
          {({ isSelected }) => (
            <Checkbox.Indicator className={cn({ "bg-black": isSelected })}>
              <Icon name="check-fill" color="#fff" size={16} />
            </Checkbox.Indicator>
          )}
        </Checkbox>
      </View>

      <View className="gap-y-0.5">
        <Text
          className={cn("font-ob-medium text-sm text-foreground leading-tight", {
            "text-muted": isCompleted,
          })}
        >
          {habit.name}
        </Text>
        <Text
          className={cn("font-ob-regular text-xs text-foreground leading-tight", {
            "text-muted": isCompleted,
          })}
        >
          {habit.description}
        </Text>
      </View>
    </PressableFeedback>
  );
}
