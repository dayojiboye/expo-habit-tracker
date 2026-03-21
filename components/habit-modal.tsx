import { StatusBar } from "expo-status-bar";
import { Input, Label, TextField } from "heroui-native";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import Icon from "react-native-remix-icon";
import { useCSSVariable } from "uniwind";

interface HabitModalProps {
	isVisible: boolean;
	onClose: () => void;
}

export function HabitModal({ isVisible, onClose }: HabitModalProps) {
	const [whiteColor] = useCSSVariable(["--white"]) as string[];

	return (
		<View>
			<Modal visible={isVisible} animationType="slide" transparent={true}>
				<StatusBar style="light" backgroundColor="transparent" translucent />
				<View className="size-full bg-black absolute top-0 pt-safe">
					<View
						className="bg-background rounded-tl-4xl rounded-tr-4xl flex-1 py-5"
						style={{ borderCurve: "continuous" }}
					>
						<View className="flex-row gap-x-6 items-center px-4">
							<Pressable
								className="bg-ht-ghost rounded-full size-8 items-center justify-center"
								onPress={onClose}
							>
								<Icon name="close-fill" size={20} />
							</Pressable>
							<Text className="text-foreground font-ob-semibold text-xl">
								Let&apos;s start a new habit
							</Text>
						</View>

						{/* Use keyboard controller */}
						<ScrollView className="flex-1" contentContainerClassName="flex-1 px-4 pt-4 gap-3">
							<TextField className="gap-1">
								<Label className="p-0">
									<Label.Text className="font-ob-regular text-foreground">Name</Label.Text>
								</Label>
								<Input
									placeholder="Type habit name"
									className="font-ob-regular border-ht-ghost bg-ht-ghost rounded-[18px] border-[2px] focus:bg-background focus:border-ht-blue text-sm"
									selectionColor={"#000"}
									style={{ boxShadow: "none" }}
								/>
							</TextField>

							<TextField className="gap-1">
								<Label className="p-0">
									<Label.Text className="font-ob-regular text-foreground">Description</Label.Text>
								</Label>
								<Input
									placeholder="Describe habit"
									className="font-ob-regular border-ht-ghost bg-ht-ghost rounded-[18px] border-[2px] focus:bg-background focus:border-ht-blue text-sm"
									selectionColor={"#000"}
									style={{ boxShadow: "none" }}
								/>
							</TextField>
						</ScrollView>
					</View>
				</View>
			</Modal>
		</View>
	);
}
