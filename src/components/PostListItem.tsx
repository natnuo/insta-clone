import { Image, Text, useIsPresent, View, XStack, YStack } from "tamagui";
import posts from "~/assets/data/posts.json";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { _GAP, _MAX_W } from "~/src/settings";
import { AdvancedImage } from "cloudinary-react-native";
import { cld } from "~/src/lib/cloudinary";
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { focusOn } from "@cloudinary/transformation-builder-sdk/qualifiers/gravity";
import { useEffect, useReducer, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";
import { CommentData, PostData } from "../lib/types";
import Comment from "./Comment";

const COMMENT_PAGINATION_LENGTH = 13;

export default function PostListItem({ post }: { post: PostData }) {
  const { width } = useWindowDimensions();
  const contWidth = Math.min(width, _MAX_W);

  const image = cld.image(post.image);
  image.resize(thumbnail().width(contWidth).height(contWidth));

  const AVATAR_W = 48;
  const postAvatar = cld.image(post.user.avatar_url);
  postAvatar.resize(
    thumbnail()
      .width(AVATAR_W)
      .height(AVATAR_W)
      .gravity(focusOn(FocusOn.face()))
  );

  const { session } = useAuth();
  const [uncertainLikeStatus, setUncertainLikeStatus] = useState(true);
  const [liked, setLiked] = useState(false);
  const fetchLiked = async () => {
    const { count, error } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session?.user.id)
      .eq("post_id", post.id);

    if (error || count === null) {
      Alert.alert("Something went wrong.", error?.message);
      return;
    }

    if (count > 0) {
      setLiked(true);
    }

    setUncertainLikeStatus(false);
  };
  const unlike = async () => {
    if (uncertainLikeStatus) return;
    setUncertainLikeStatus(true);

    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", session?.user.id)
      .eq("post_id", post.id);

    if (error) {
      Alert.alert("Something went wrong.", error.message);
      return;
    }

    setLiked(false);
    setUncertainLikeStatus(false);
  };
  const like = async () => {
    if (uncertainLikeStatus) return;
    setUncertainLikeStatus(true);

    const { error } = await supabase.from("likes").insert({
      user_id: session?.user.id,
      post_id: post.id,
    });

    if (error) {
      Alert.alert("Something went wrong.", error.message);
      return;
    }

    setLiked(true);
    setUncertainLikeStatus(false);
  };

  const [comments, addLoadedComments] = useReducer(
    (state: CommentData[], newComments: CommentData[]) => {
      state.push(...newComments);
      return state;
    },
    []
  );
  const [allCommentsLoaded, setAllCommentsLoaded] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [uncertainCommentsStatus, setUncertainCommentsStatus] = useState(false);
  const openComments = () => {
    if (comments.length === 0) {
      loadMoreComments();
    }

    setCommentsVisible(true);
  };
  // optimize stuff (reduce re-renders) with memo and useCallback later
  const loadMoreComments = async () => {
    if (uncertainCommentsStatus) return;
    setUncertainCommentsStatus(true);

    const { data, error } = await supabase
      .from("comments")
      .select("*, user:profiles(*)")
      .eq("post_id", post.id)
      .range(comments.length, comments.length + COMMENT_PAGINATION_LENGTH - 1); // inclusive

    if (error || data === null) {
      Alert.alert("Something went wrong.", error.message);
      return;
    }

    if (data.length < COMMENT_PAGINATION_LENGTH) {
      setAllCommentsLoaded(true);
    }

    addLoadedComments(data);

    setUncertainCommentsStatus(false);
  };
  // const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const [commentInput, setCommentInput] = useState("");
  const addComment = async () => {
    const { error } = await supabase.from("comments").insert({
      user_id: session?.user.id,
      post_id: post.id,
      text: commentInput,
    });

    if (error) {
      Alert.alert("Something went wrong.", error.message);
      return;
    }

    setCommentInput("");
  };

  useEffect(() => {
    fetchLiked();
  }, []);

  return (
    <YStack backgroundColor={"white"}>
      {/* Header */}
      <XStack alignItems="center" gap={_GAP} padding={_GAP}>
        <AdvancedImage
          cldImg={postAvatar}
          width={AVATAR_W}
          borderRadius={Number.MAX_SAFE_INTEGER}
          style={{ aspectRatio: 1 }}
        ></AdvancedImage>
        <Text>{post.user.username}</Text>
      </XStack>

      {/* Image */}
      <AdvancedImage
        cldImg={image}
        style={{ aspectRatio: 1, width: "100%" }}
      ></AdvancedImage>

      {/* Reactions */}
      <XStack gap={_GAP} padding={_GAP}>
        {liked ? (
          <Entypo name="heart" size={24} onPress={unlike} />
        ) : (
          <Entypo name="heart-outlined" size={24} onPress={like} />
        )}
        <Feather name="message-circle" size={24} onPress={openComments} />
        <Feather name="send" size={24} />

        <Feather name="bookmark" size={24} className="ml-auto" />
      </XStack>

      {/* <View position="absolute" width={screenWidth} height={screenHeight}> */}
      <Modal
        animationType="slide"
        transparent={false}
        presentationStyle="formSheet"
        visible={commentsVisible}
        onRequestClose={() => {
          setCommentsVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={60}
        >
          <View style={{ padding: 24, justifyContent: "space-between" }}>
            <View height={"85%"}>
              <FlatList
                data={comments}
                keyExtractor={(comment) => comment.id}
                renderItem={({ item }) => <Comment comment={item}></Comment>}
                onEndReached={allCommentsLoaded ? () => {} : loadMoreComments}
                onEndReachedThreshold={0.1}
              ></FlatList>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                height: "15%",
                paddingTop: 12,
              }}
            >
              <TextInput
                placeholder="Add a comment"
                value={commentInput}
                onChangeText={setCommentInput}
                style={{
                  lineHeight: 0,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "lightgray",
                  borderRadius: 12,
                  flex: 1,
                }}
              ></TextInput>
              <AntDesign
                name="arrowup"
                size={24}
                onPress={addComment}
              ></AntDesign>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* </View> */}
    </YStack>
  );
}
