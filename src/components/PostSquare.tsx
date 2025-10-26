import { View } from "tamagui";
import { PostData } from "../lib/types";
import { cld } from "../lib/cloudinary";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "cloudinary-react-native";
import { KeyboardAvoidingView, Modal, Platform, Pressable } from "react-native";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PostListItem from "./PostListItem";

export default function PostSquare({
  post,
  sideLength,
  onRefresh,
  refreshCnt
}: {
  post: PostData;
  sideLength: number;
  onRefresh: () => void;
  refreshCnt: number;
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
          <Pressable className="absolute top-10 right-8 z-50" onPress={() => {
            setFullPostVisible(false);
          }}>
            <FontAwesome name="close" color={"#000"} size={22} />
          </Pressable>
          <View style={{ padding: 24, justifyContent: "space-between" }}>
            <PostListItem post={post} onRefresh={onRefresh} refreshCnt={refreshCnt}></PostListItem>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
