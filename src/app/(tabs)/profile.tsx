import { useCallback, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Image, Input, Label, XStack, YStack } from "tamagui";
import ImagePicker from "~/src/components/ImagePicker";
import StringInputField from "~/src/components/StringInputField";
import { supabase } from "~/src/lib/supabase";
import { _GAP, _MAX_W } from "~/src/settings";

// TODO: set default username & related to curr/prev value

export default function ProfileScreen() {
    const [image, setImage] = useState<string>();

    const [username, setUsername] = useState<string>();

    const saveSettings = useCallback(() => {

    }, []);

    const signOut = useCallback(() => {
        supabase.auth.signOut();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <YStack
                maxWidth={_MAX_W}
                alignItems="center"
                gap={_GAP}
                padding={_GAP}
                width={"100%"}
            >
                {/* Avatar picker */}
                <Image
                    source={{
                        uri: image,
                    }}
                    width={200}
                    aspectRatio={1}
                    borderRadius={Number.MAX_SAFE_INTEGER}
                    backgroundColor={"lightpink"}
                ></Image>
                <ImagePicker
                    onImageChange={(newImage) => setImage(newImage)}
                    buttonProps={{ width: "100%" }}
                >
                    Change
                </ImagePicker>

                {/* Field inputs */}
                <StringInputField
                    name="Username"
                    idroot="username"
                    currVal={username}
                    onInput={setUsername}
                ></StringInputField>

                {/* Save button */}
                <Button onPress={saveSettings} width={"100%"}>Update Profile</Button>
                <Button onPress={signOut} width={"100%"} theme="accent">Sign Out</Button>
            </YStack>
        </TouchableWithoutFeedback>
    );
}

