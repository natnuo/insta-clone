import { Stack } from "expo-router";
import "../../global.css";
import { createTamagui, TamaguiProvider } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";

const config = createTamagui(defaultConfig);

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Stack screenOptions={{ headerShown: false }}></Stack>
    </TamaguiProvider>
  ); // wrapped around any screen under root
}
