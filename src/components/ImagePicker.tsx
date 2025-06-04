import { JSX, useEffect, useState } from "react";
import * as ImagePickerLib from "expo-image-picker";
import { Button, ButtonProps } from "tamagui";

export default function ImagePicker({
    onImageChange,
    children,
    buttonProps,
    autoAsk
}: {
    onImageChange: (image: string) => void,
    children?: JSX.Element | string,
    buttonProps?: ButtonProps
    autoAsk?: boolean
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
    useEffect(() => {if(autoAsk===true) pickImage();}, []);

    return <Button onPress={pickImage} {...buttonProps}>{children}</Button>;
}
