import { Stack } from "expo-router";
import "../../global.css";
import { createTamagui, TamaguiProvider, View } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const config = createTamagui(defaultConfig);

export default function RootLayout() {
    return (
        <TamaguiProvider config={config}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View flex={1}>
                <Stack screenOptions={{ headerShown: false }}></Stack>
              </View>
            </TouchableWithoutFeedback>
        </TamaguiProvider>
    ); // wrapped around any screen under root
}
