import { widths } from "@tamagui/config";
import { useEffect, useState } from "react";
import { Button, Image, Text, TextArea, View, YStack } from "tamagui";
import { _BR, _GAP, _MAX_W } from "~/src/settings";
import * as ImagePicker from "expo-image-picker";

export default function CreatePost() {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState<string>();

    useEffect(() => {
        if (!image) pickImage();
    }, [image]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <YStack
            maxWidth={_MAX_W}
            alignSelf="center"
            gap={_GAP}
            padding={_GAP}
            width={"100%"}
        >
            {/* Image picker */}
            <Image
                source={{
                    uri: image,
                }}
                width="100%"
                aspectRatio={1}
                borderRadius={_BR}
                backgroundColor={"lightpink"}
            ></Image>
            <Button onPress={pickImage}>Change</Button>

            {/* Caption input */}
            <TextArea
                placeholder="Write about your image ✏️"
                onChangeText={(v) => setCaption(v)}
            ></TextArea>

            {/* Post button */}
            {
                image &&
                <Button theme={"accent"}>Share post</Button>
            }
        </YStack>
    );
}
