import { Redirect, Stack, Tabs } from "expo-router";
import { useAuth } from "~/src/providers/AuthProvider";

export default function AuthLayout() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Redirect href="/(tabs)"></Redirect>;
    }

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{ title: "Login" }}
            ></Tabs.Screen>
            <Tabs.Screen
                name="sign_up"
                options={{ title: "Sign Up" }}
            ></Tabs.Screen>
        </Tabs>
    );
}
