import { Stack } from "expo-router";
import "../../global.css";
import { createTamagui, TamaguiProvider, View } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import AuthProvider from "../providers/AuthProvider";

const config = createTamagui(defaultConfig);

export default function RootLayout() {
    return (
        <TamaguiProvider config={config}>
          <AuthProvider>
            <View flex={1}>
              <Stack screenOptions={{ headerShown: false }}></Stack>
            </View>
          </AuthProvider>
        </TamaguiProvider>
    ); // wrapped around any screen under root
}
