import { Text, View } from "tamagui";
import { CommentData } from "../lib/types";
import { cld } from "../lib/cloudinary";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { focusOn } from "@cloudinary/transformation-builder-sdk/qualifiers/gravity";
import { AdvancedImage } from "cloudinary-react-native";
import { max } from "@cloudinary/transformation-builder-sdk/actions/roundCorners";

export default function Comment({ comment }: { comment: CommentData }) {
  const commentAvatar = cld.image(comment.user.avatar_url);
  const AVATAR_W = 32;
  commentAvatar
    .resize(
      thumbnail()
        .width(2 * AVATAR_W)
        .height(2 * AVATAR_W)
        .gravity(focusOn(FocusOn.face()))
    )
    .roundCorners(max());

  return (
    <View flexDirection="row" gap={12} marginBottom={12}>
      <AdvancedImage
        cldImg={commentAvatar}
        style={{ aspectRatio: 1, width: AVATAR_W, backgroundColor: "#000", borderRadius: 50 }}
      ></AdvancedImage>
      <View gap={4}>
        <Text fontWeight={"bold"}>{comment.user.username}</Text>
        <Text>{comment.text}</Text>
      </View>
    </View>
  );
}
