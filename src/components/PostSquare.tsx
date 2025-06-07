import { View } from "tamagui";
import { PostData } from "../lib/types";
import { cld } from "../lib/cloudinary";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "cloudinary-react-native";
import { KeyboardAvoidingView, Modal, Platform } from "react-native";
import { useState } from "react";
import PostListItem from "./PostListItem";

export default function PostSquare({
  post,
  sideLength,
  onRefresh,
}: {
  post: PostData;
  sideLength: number;
  onRefresh: () => void;
}) {
  const [fullPostVisible, setFullPostVisible] = useState(false);

  const image = cld.image(post.image);
  image.resize(thumbnail().width(sideLength).height(sideLength));

  return (
    <View>
      <View onPress={() => setFullPostVisible(true)}>
        <AdvancedImage
          cldImg={image}
          style={{ aspectRatio: 1, width: sideLength }}
        ></AdvancedImage>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        presentationStyle="pageSheet"
        visible={fullPostVisible}
        onRequestClose={() => {
          setFullPostVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={60}
        >
          <View style={{ padding: 24, justifyContent: "space-between" }}>
            <PostListItem post={post} onRefresh={onRefresh}></PostListItem>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
