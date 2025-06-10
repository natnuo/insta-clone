import { widths } from "@tamagui/config";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
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

  const [createPostLoading, setCreatePostLoading] = useState(false);

  const { session } = useAuth();

  const createPost = useCallback(async () => {
    if (createPostLoading) return;
    setCreatePostLoading(true);

    try {
      const response = await uploadImage(image);

      const { error } = await supabase
        .from("posts")
        .insert([
          {
            caption,
            image: response?.public_id,
            user_id: session?.user.id,
          },
        ])
        .select();
      
      if (error) {
        Alert.alert("Something unexpected happened");
        throw error;
      }

      router.push("/(tabs)");

      setCaption("");
    } finally {
      setCreatePostLoading(false);
    }
  }, [image, caption, createPostLoading]);

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
            <Button theme={createPostLoading ? "" : "accent"} onPress={createPost} disabled={createPostLoading}>
              Share post
            </Button>
          )}
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
