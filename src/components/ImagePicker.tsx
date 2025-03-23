import { useEffect, useState } from "react";
import * as ImagePickerLib from "expo-image-picker";
import { Button, ButtonProps } from "tamagui";

export default function ImagePicker({
    onImageChange,
    children,
    buttonProps
}: {
    onImageChange: (image: string) => void,
    children?: JSX.Element | string,
    buttonProps?: ButtonProps
}) {
    const pickImage = async () => {
        let result = await ImagePickerLib.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            onImageChange(result.assets[0].uri);
        }
    };

    return <Button onPress={pickImage} {...buttonProps}>{children}</Button>;
}
