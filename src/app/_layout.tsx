import { Stack } from "expo-router";
import "../../global.css";
import { createTamagui, TamaguiProvider, View } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";

const config = createTamagui(defaultConfig);

export default function RootLayout() {
    return (
        <TamaguiProvider config={config}>
          <View flex={1}>
            <Stack screenOptions={{ headerShown: false }}></Stack>
          </View>
        </TamaguiProvider>
    ); // wrapped around any screen under root
}
