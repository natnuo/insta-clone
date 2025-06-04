import { Text, View, XStack, YStack } from "tamagui";
import { UserDataSimple } from "../lib/types";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { FocusOn } from "@cloudinary/transformation-builder-sdk/qualifiers/focusOn";
import { focusOn } from "@cloudinary/transformation-builder-sdk/qualifiers/gravity";
import { AdvancedImage } from "cloudinary-react-native";
import { cld } from "../lib/cloudinary";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function ProfileRow({ user }: { user: UserDataSimple }) {
  const AVATAR_W = 48;
  const postAvatar = cld.image(user.avatar_url);
  postAvatar.resize(
    thumbnail()
      .width(AVATAR_W)
      .height(AVATAR_W)
      .gravity(focusOn(FocusOn.face()))
  );

  const [redirect, setRedirect] = useState(false);

  return (<XStack alignItems="center" gap={12} onPress={() => setRedirect(true)}>
    {redirect && <Redirect href={"user/" + user.id}></Redirect>}
    <AdvancedImage
      cldImg={postAvatar}
      width={48}
      style={{ aspectRatio: 1, backgroundColor: "black" }}
      borderRadius={Number.MAX_SAFE_INTEGER}
    ></AdvancedImage>
    <Text fontWeight={"bold"}>{user.username}</Text>
  </XStack>);
}