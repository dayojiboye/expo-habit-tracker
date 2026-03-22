import { STORED_HABITS } from "@/constants/core";
import { HabitIcons } from "@/constants/habit-icons";
import { Habit } from "@/types/habit";
import { zodResolver } from "@hookform/resolvers/zod";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  cn,
  FieldError,
  Input,
  Label,
  PressableFeedback,
  TextField,
  useToast,
} from "heroui-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, Modal, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Icon, { IconName } from "react-native-remix-icon";
import { useCSSVariable } from "uniwind";
import { z } from "zod";

interface HabitModalProps {
  isVisible: boolean;
  onClose: () => void;
  habits: Habit[];
  habit: Habit | null;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const COLOR_VARS = [
  "--color-ht-yellow",
  "--color-ht-pink",
  "--color-ht-light-blue",
  "--color-ht-green",
  "--color-ht-orange",
  "--color-ht-teal",
];

const addHabitFormSchema = z.object({
  name: z.string().trim().min(1, "Please enter a name for habit"),
  description: z.string().trim().min(1, "Please enter a description for habit"),
  icon: z.custom<IconName>((val) => typeof val === "string"),
});

const defaultFormValues: z.infer<typeof addHabitFormSchema> = {
  name: "",
  description: "",
  icon: "briefcase-fill",
};

export function HabitModal({
  isVisible,
  onClose,
  habits,
  habit,
  setHabits,
}: HabitModalProps) {
  const colors = useCSSVariable(COLOR_VARS) as string[];
  const { width } = Dimensions.get("window");
  const ITEM_SIZE = (width - 32 - 20) / 4;
  const { toast } = useToast();

  const addHabitForm = useForm<z.infer<typeof addHabitFormSchema>>({
    resolver: zodResolver(addHabitFormSchema),
    defaultValues: defaultFormValues,
  });

  function handleClose() {
    addHabitForm.reset(defaultFormValues);
    onClose();
  }

  function createHabit(values: z.infer<typeof addHabitFormSchema>) {
    const updatedHabits = [
      {
        ...values,
        daysCompleted: [],
      },
      ...habits,
    ];

    setHabits(updatedHabits);
    SecureStore.setItem(STORED_HABITS, JSON.stringify(updatedHabits));

    toast.show({
      variant: "success",
      label: "Habit created successfully",
    });
  }

  function updateHabit(values: z.infer<typeof addHabitFormSchema>) {
    if (!habit) return;
    const habitIndex = habits.findIndex(
      (h) => h.name.toLowerCase() === habit.name.toLowerCase(),
    );

    if (habitIndex === -1) return;

    const updatedHabits = habits.map((h, i) => {
      return i === habitIndex ? { ...h, ...values } : h;
    });

    setHabits(updatedHabits);
    SecureStore.setItem(STORED_HABITS, JSON.stringify(updatedHabits));

    toast.show({
      variant: "success",
      label: "Habit updated successfully",
    });
  }

  function deleteHabit() {
    if (!habit) return;
    const habitIndex = habits.findIndex(
      (h) => h.name.toLowerCase() === habit.name.toLowerCase(),
    );

    if (habitIndex === -1) return;

    const updatedHabits = habits.filter((_, i) => i !== habitIndex);

    setHabits(updatedHabits);
    SecureStore.setItem(STORED_HABITS, JSON.stringify(updatedHabits));

    toast.show({
      variant: "success",
      label: "Habit deleted successfully",
    });

    handleClose();
  }

  function onSubmit(values: z.infer<typeof addHabitFormSchema>) {
    if (
      !habit &&
      habits.some(
        (habit) => habit.name.toLowerCase() === values.name.toLowerCase(),
      )
    ) {
      toast.show({
        variant: "danger",
        label: "This habit already exists",
      });
      return;
    }

    if (habit) updateHabit(values);
    else createHabit(values);

    handleClose();
  }

  useEffect(() => {
    if (habit) {
      addHabitForm.reset({
        name: habit.name,
        description: habit.description,
        icon: habit.icon,
      });
    }
  }, [habit, addHabitForm]);

  return (
    <View>
      <Modal visible={isVisible} animationType="slide" transparent={true}>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <View className="size-full bg-black absolute top-0 pt-safe">
          <View
            className="bg-background rounded-tl-4xl rounded-tr-4xl flex-1 pt-5"
            style={{ borderCurve: "continuous" }}
          >
            <View className="flex-row gap-x-6 items-center px-4">
              <Pressable
                className="bg-ht-ghost rounded-full size-8 items-center justify-center"
                onPress={handleClose}
              >
                <Icon name="close-fill" size={20} />
              </Pressable>
              <Text className="text-foreground font-ob-semibold text-xl">
                {!!habit ? "Edit habit" : "Let's start a new habit"}
              </Text>
            </View>

            <KeyboardAwareScrollView
              className="flex-1"
              contentContainerClassName="grow px-4 pt-4 gap-3"
              keyboardShouldPersistTaps="always"
            >
              <Controller
                control={addHabitForm.control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField className="gap-1" isInvalid={fieldState.invalid}>
                    <Label className="p-0">
                      <Label.Text className="font-ob-regular text-foreground text-sm">
                        Name
                      </Label.Text>
                    </Label>
                    <Input
                      placeholder="Type habit name"
                      className={cn(
                        "font-ob-regular border-ht-ghost bg-ht-ghost rounded-[18px] border-[2px]",
                        "focus:bg-background focus:border-ht-blue text-sm leading-snug",
                        {
                          "border-danger focus:border-danger":
                            fieldState.invalid,
                        },
                      )}
                      selectionColor={"#000"}
                      style={{ boxShadow: "none" }}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      value={field.value}
                    />
                    <FieldError
                      classNames={{
                        text: "font-ob-regular text-xs text-danger",
                      }}
                    >
                      {fieldState.error?.message}
                    </FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={addHabitForm.control}
                name="description"
                render={({ field, fieldState }) => (
                  <TextField className="gap-1" isInvalid={fieldState.invalid}>
                    <Label className="p-0">
                      <Label.Text className="font-ob-regular text-foreground text-sm">
                        Description
                      </Label.Text>
                    </Label>
                    <Input
                      placeholder="Describe habit"
                      className={cn(
                        "font-ob-regular border-ht-ghost bg-ht-ghost rounded-[18px] border-[2px]",
                        "focus:bg-background focus:border-ht-blue text-sm leading-snug",
                        {
                          "border-danger focus:border-danger":
                            fieldState.invalid,
                        },
                      )}
                      selectionColor={"#000"}
                      style={{ boxShadow: "none" }}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      value={field.value}
                    />
                    <FieldError
                      classNames={{
                        text: "font-ob-regular text-xs text-danger",
                      }}
                    >
                      {fieldState.error?.message}
                    </FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={addHabitForm.control}
                name="icon"
                render={({ field, fieldState }) => (
                  <TextField>
                    <Label className="p-0">
                      <Label.Text className="font-ob-regular text-foreground text-sm">
                        Icon
                      </Label.Text>
                    </Label>
                    <View className="flex-row flex-wrap gap-1.5 justify-between">
                      {HabitIcons.map((icon, index) => (
                        <PressableFeedback
                          key={icon}
                          className={cn(
                            "rounded-[20px] items-center justify-center border-[3px] border-transparent",
                            { "border-accent": field.value === icon },
                          )}
                          style={{
                            borderCurve: "continuous",
                            backgroundColor:
                              colors?.[index % colors.length] ?? "#f7cd63",
                            width: ITEM_SIZE,
                            height: 80,
                          }}
                          onPress={() => {
                            addHabitForm.setValue("icon", icon, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                        >
                          <Icon name={icon} size={24} color={"#000"} />
                        </PressableFeedback>
                      ))}
                    </View>
                  </TextField>
                )}
              />
            </KeyboardAwareScrollView>

            <View className="pt-4 pb-safe bg-background px-4 justify-center gap-2">
              <Button
                size="lg"
                className="bg-ht-blue rounded-[16px]"
                feedbackVariant="scale"
                style={{ borderCurve: "continuous" }}
                onPress={addHabitForm.handleSubmit(onSubmit)}
              >
                <Button.Label className="font-ob-medium text-sm">
                  {!!habit ? "Update Habit" : "Add Habit"}
                </Button.Label>
              </Button>

              {habit ? (
                <Button
                  size="lg"
                  variant="danger"
                  className="rounded-[16px]"
                  feedbackVariant="scale"
                  style={{ borderCurve: "continuous" }}
                  onPress={deleteHabit}
                >
                  <Button.Label className="font-ob-medium text-sm">
                    Delete Habit
                  </Button.Label>
                </Button>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
