import { AdvancedImage } from "cloudinary-react-native";
import { useCallback, useEffect, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { Button, Image, Input, Label, XStack, YStack } from "tamagui";
import ImagePicker from "~/src/components/ImagePicker";
import StringInputField from "~/src/components/StringInputField";
import { cld, uploadImage } from "~/src/lib/cloudinary";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider";
import { _GAP, _MAX_W } from "~/src/settings";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { focusOn } from "@cloudinary/transformation-builder-sdk/qualifiers/gravity";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { reload } from "expo-router/build/global-state/routing";
import { reloadAppAsync } from "expo";

// TODO: set default username & related to curr/prev value

export default function ProfileScreen() {
  const { session } = useAuth();

  const [image, setImage] = useState<string>();
  const [username, setUsername] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);

  const [customUploaded, setCustomUploaded] = useState(false);

  const saveSettings = useCallback(async () => {
    if (!username || !session) return;

    let response = undefined;
    if (customUploaded)
      response = await uploadImage(image);

    setLoading(true);

    try {
      const updates = {
        id: session.user.id,
        username,
        avatar_url: response?.public_id ?? image,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      reloadAppAsync();
    }
  }, [username, image]);

  const [cldImage, setCldImage] = useState<CloudinaryImage>(
    cld.image("blank-image")
  );
  useEffect(() => {
    if (!customUploaded) {
      const AVATAR_W = 200;
      const avatar = cld.image(image ?? "blank-image");
      avatar.resize(
        thumbnail()
          .width(AVATAR_W)
          .height(AVATAR_W)
          .gravity(focusOn(FocusOn.face()))
      );
      setCldImage(avatar);
    }
  }, [image, customUploaded]);

  useEffect(() => {
    if (session) fetchProfileInfo();
  }, [session]);

  const fetchProfileInfo = useCallback(async () => {
    setLoading(true);

    try {
      let { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", session?.user.id)
        .single();

      if (error || !data) {
        Alert.alert("Something went wrong.", error?.message);
        return;
      }

      setUsername(data.username);
      setImage(data.avatar_url);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const signOut = useCallback(() => {
    supabase.auth.signOut();
  }, []);

  return (
    <KeyboardAvoidingView behavior={"position"} keyboardVerticalOffset={100}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack
          maxWidth={_MAX_W}
          alignItems="center"
          gap={_GAP}
          padding={_GAP}
          width={"100%"}
        >
          {/* Avatar picker */}
          {customUploaded ? (
            <Image
              source={{
                uri: image,
              }}
              width={200}
              aspectRatio={1}
              backgroundColor={"black"}
              borderRadius={Number.MAX_SAFE_INTEGER}
            ></Image>
          ) : (
            <AdvancedImage
              cldImg={cldImage}
              width={200}
              style={{ aspectRatio: 1, backgroundColor: "black" }}
              borderRadius={Number.MAX_SAFE_INTEGER}
            ></AdvancedImage>
          )}
          <ImagePicker
            onImageChange={(newImage) => {
              setImage(newImage);
              setCustomUploaded(true);
            }}
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
          <Button onPress={saveSettings} width={"100%"}>
            Update Profile
          </Button>
          <Button
            onPress={signOut}
            width={"100%"}
            theme="accent"
            disabled={loading}
          >
            Sign Out
          </Button>
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
