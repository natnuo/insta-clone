import { widths } from "@tamagui/config";
import { useCallback, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Image, Text, TextArea, View, YStack } from "tamagui";
import ImagePicker from "~/src/components/ImagePicker";
import { uploadImage } from "~/src/lib/cloudinary";
import { _BR, _GAP, _MAX_W } from "~/src/settings";

export default function CreatePost() {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState<string>();

    const createPost = useCallback(async () => {
        const response = await uploadImage(image);
    }, [image]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                <ImagePicker onImageChange={(newImage) => setImage(newImage)}>
                    Change
                </ImagePicker>

                {/* Caption input */}
                <TextArea
                    placeholder="Write about your image ✏️"
                    onChangeText={(v) => setCaption(v)}
                ></TextArea>

                {/* Post button */}
                {image && <Button theme={"accent"} onPress={createPost}>Share post</Button>}
            </YStack>
        </TouchableWithoutFeedback>
    );
}
