import { useState } from "react";
import { Image, Input, Label, XStack, YStack } from "tamagui";
import ImagePicker from "~/src/components/ImagePicker";
import { _GAP, _MAX_W } from "~/src/settings";

// TODO: set default username & related to curr/prev value

export default function ProfileScreen() {
    const [image, setImage] = useState<string>();

    const [username, setUsername] = useState<string>();

    return (
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
        </YStack>
    );
}

function StringInputField({
    name,
    idroot,
    currVal,
    onInput,
}: {
    name: string;
    idroot: string;
    currVal: string | undefined;
    onInput: (newVal: string) => void;
}) {
    return (
        <XStack gap={_GAP} alignItems="center" display={"flex"}>
            <Label htmlFor={`${idroot}-inp`} width={"40%"}>
                {name}
            </Label>
            <Input
                id={`${idroot}-inp`}
                value={currVal}
                onChangeText={onInput}
                flex={1}
            ></Input>
        </XStack>
    );
}
