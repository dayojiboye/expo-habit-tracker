import { HabitIcons } from "@/constants/habit-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  cn,
  FieldError,
  Input,
  Label,
  PressableFeedback,
  TextField,
} from "heroui-native";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, Modal, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Icon, { IconName } from "react-native-remix-icon";
import { useCSSVariable } from "uniwind";
import { z } from "zod";

interface HabitModalProps {
  isVisible: boolean;
  onClose: () => void;
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

export function HabitModal({ isVisible, onClose }: HabitModalProps) {
  const colors = useCSSVariable(COLOR_VARS) as string[];
  const { width } = Dimensions.get("window");
  const ITEM_SIZE = (width - 32 - 20) / 4;

  const addHabitForm = useForm<z.infer<typeof addHabitFormSchema>>({
    resolver: zodResolver(addHabitFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "briefcase-fill",
    },
  });

  function handleClose() {
    addHabitForm.reset();
    onClose();
  }

  function onSubmit(values: z.infer<typeof addHabitFormSchema>) {
    console.log(values);
  }

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
                Let&apos;s start a new habit
              </Text>
            </View>

            <KeyboardAwareScrollView
              className="flex-1"
              contentContainerClassName="grow px-4 pt-4 gap-3"
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

            <View className="h-25 pt-4 pb-safe bg-background px-4 justify-center">
              <Button
                size="lg"
                className="bg-ht-blue rounded-[16px]"
                feedbackVariant="scale"
                style={{ borderCurve: "continuous" }}
                onPress={addHabitForm.handleSubmit(onSubmit)}
              >
                <Button.Label className="font-ob-medium text-sm">
                  Add Habit
                </Button.Label>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
