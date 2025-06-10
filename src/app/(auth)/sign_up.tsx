import { Session } from "@supabase/supabase-js";
import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import { Button } from "tamagui";
import StringInputField from "~/src/components/StringInputField";
import { supabase } from "~/src/lib/supabase";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
    if (state === "active") {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");

    async function signUpWithEmail() {
        setLoading(true);

        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                Alert.alert(error.message);
                throw error;
            }
            if (!session) {
                throw "Session Null";
            }

            const {error: e2} = await supabase
                .from("profiles")
                .upsert({
                    id: session?.user.id,
                    username
                });
            
            if (e2) {
                Alert.alert(e2.message);
                throw error;
            }
            
            // if (!session)
            //     Alert.alert("Please check your inbox for email verification!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <StringInputField
                    name="Email"
                    idroot="email"
                    currVal={email}
                    onInput={setEmail}
                    inputProps={{
                        placeholder: "email@address.com",
                        autoCapitalize: "none",
                    }}
                ></StringInputField>
            </View>
            <View style={styles.verticallySpaced}>
                <StringInputField
                    name="Username"
                    idroot="username"
                    currVal={username}
                    onInput={setUsername}
                    inputProps={{ secureTextEntry: false }}
                ></StringInputField>
            </View>
            <View style={styles.verticallySpaced}>
                <StringInputField
                    name="Password"
                    idroot="password"
                    currVal={password}
                    onInput={setPassword}
                    inputProps={{ secureTextEntry: true }}
                ></StringInputField>
            </View>
            <View style={styles.verticallySpaced}>
                <Button disabled={loading} onPress={() => signUpWithEmail()}>
                    Sign Up
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: "stretch",
    },
    mt20: {
        marginTop: 20,
    },
});
