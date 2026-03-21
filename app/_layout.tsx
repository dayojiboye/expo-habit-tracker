import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native/provider";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import { Uniwind } from "uniwind";
import "../global.css";

Uniwind.setTheme("light");
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ObLight: require("../assets/fonts/ObviouslyDemo-Light.otf"),
    ObRegular: require("../assets/fonts/ObviouslyDemo-Regular.otf"),
    ObMedium: require("../assets/fonts/ObviouslyDemo-Medium.otf"),
    ObSemibold: require("../assets/fonts/ObviouslyDemo-Semibold.otf"),
    ObBold: require("../assets/fonts/ObviouslyDemo-Bold.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <HeroUINativeProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </HeroUINativeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
