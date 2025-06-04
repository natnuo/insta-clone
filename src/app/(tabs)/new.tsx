import { widths } from "@tamagui/config";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Button,
  Image,
  Text,
  TextArea,
  useAdaptContext,
  View,
  YStack,
} from "tamagui";
import ImagePicker from "~/src/components/ImagePicker";
import { uploadImage } from "~/src/lib/cloudinary";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider";
import { _BR, _GAP, _MAX_W } from "~/src/settings";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string>();

  const { session } = useAuth();

  const createPost = useCallback(async () => {
    const response = await uploadImage(image);

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          caption,
          image: response?.public_id,
          user_id: session?.user.id,
        },
      ])
      .select();

    router.push("/(tabs)");

    setCaption("");
  }, [image, caption]);

  return (
    <KeyboardAvoidingView
      behavior={"position"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack
          maxWidth={_MAX_W}
          alignSelf="center"
          gap={_GAP}
          display="flex"
          padding={_GAP}
          width={"100%"}
          height={"100%"}
        >
          {/* Image picker */}
          <Image
            source={{
              uri: image,
            }}
            width="100%"
            aspectRatio={1}
            borderRadius={_BR}
            backgroundColor={"black"}
          ></Image>
          <ImagePicker autoAsk onImageChange={(newImage) => setImage(newImage)}>
            Change
          </ImagePicker>

          {/* Caption input */}
          <TextArea
            placeholder="Write about your image"
            value={caption}
            flexGrow={1}
            borderWidth={0}
            onChangeText={(v) => setCaption(v)}
          ></TextArea>

          {/* Post button */}
          {image && (
            <Button theme={"accent"} onPress={createPost}>
              Share post
            </Button>
          )}
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
