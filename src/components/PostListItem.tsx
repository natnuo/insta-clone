import {
  Button,
  Image,
  Text,
  useIsPresent,
  View,
  XStack,
  YStack,
} from "tamagui";
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
import { auto, thumbnail } from "@cloudinary/url-gen/actions/resize";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { focusOn } from "@cloudinary/transformation-builder-sdk/qualifiers/gravity";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";
import { CommentData, PostData } from "../lib/types";
import Comment from "./Comment";
import { Link } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const COMMENT_PAGINATION_LENGTH = 13;

export default function PostListItem({
  post,
  onRefresh,
  refreshCnt,
}: {
  post: PostData;
  onRefresh: () => void;
  refreshCnt: number;
}) {
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
    } else {
      setLiked(false);
    }

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

  const [loadingSaved, setLoadingSaved] = useState(false);
  const [saved, setSaved] = useState(false);
  const fetchSaved = async () => {
    if (loadingSaved) return;

    try {
      setLoadingSaved(true);

      const { count, error } = await supabase
        .from("post_saves")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session?.user.id)
        .eq("post_id", post.id);

      if (error || count === null) {
        Alert.alert("Something unexpected happened");
        throw error;
      }

      if (count > 0) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    } finally {
      setLoadingSaved(false);
    }
  };
  const savePost = async () => {
    if (loadingSaved) return;

    try {
      setLoadingSaved(true);

      const { error } = await supabase.from("post_saves").insert({
        user_id: session?.user.id,
        post_id: post.id,
      });

      if (error) {
        Alert.alert("Something unexpected happened");
        throw error;
      }

      setSaved(true);
    } finally {
      setLoadingSaved(false);
    }
  };
  const unsavePost = async () => {
    if (loadingSaved) return;

    try {
      setLoadingSaved(true);

      const { error } = await supabase
        .from("post_saves")
        .delete()
        .eq("user_id", session?.user.id)
        .eq("post_id", post.id);

      if (error) {
        Alert.alert("Something unexpected happened");
        throw error;
      }

      setSaved(false);
    } finally {
      setLoadingSaved(false);
    }
  };

  const [comments, updateLoadedComments] = useReducer(
    (
      state: CommentData[],
      [action, aComments]: ["add" | "set", CommentData[]]
    ) => {
      if (action === "add") {
        state.push(...aComments);
      } else {
        state = aComments;
      }
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

    updateLoadedComments(["add", data]);

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

    updateLoadedComments(["set", []]);

    setCommentInput("");
  };

  useEffect(() => {
    if (commentsVisible && comments.length === 0) loadMoreComments();
  }, [commentsVisible, comments]);

  useEffect(() => {
    fetchLiked();
    fetchSaved();
  }, [refreshCnt]);

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const [loadingDeletePost, setLoadingDeletePost] = useState(false);
  const deletePost = useCallback(async () => {
    if (loadingDeletePost) return;

    try {
      setLoadingDeletePost(true);

      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      console.log(error, post.id);

      if (error) {
        Alert.alert("Something unexpected happened");
        throw error;
      }

      setConfirmDeleteVisible(false);
      onRefresh();
    } finally {
      setLoadingDeletePost(false);
    }
  }, [loadingDeletePost, post]);

  return (
    <YStack backgroundColor={"white"}>
      {/* Header */}
      <XStack alignItems="center" gap={_GAP} padding={_GAP}>
        <AdvancedImage
          cldImg={postAvatar}
          width={AVATAR_W}
          borderRadius={Number.MAX_SAFE_INTEGER}
          style={{ aspectRatio: 1, backgroundColor: "black" }}
        ></AdvancedImage>
        <Link
          href={{
            pathname: "/user/[userId]",
            params: { userId: post.user.id },
          }}
        >
          {post.user.username}
        </Link>
      </XStack>

      {/* Image */}
      <AdvancedImage
        cldImg={image}
        style={{ aspectRatio: 1, width: "100%", backgroundColor: "black" }}
      ></AdvancedImage>

      {/* Caption */}
      <Text marginHorizontal={8} marginVertical={4}>
        <Text fontWeight={"bold"}>{post.user.username}</Text> {post.caption}
      </Text>

      {/* Reactions */}
      <XStack gap={_GAP} padding={_GAP}>
        {liked ? (
          <Entypo name="heart" size={24} onPress={unlike} />
        ) : (
          <Entypo name="heart-outlined" size={24} onPress={like} />
        )}
        <Feather name="message-circle" size={24} onPress={openComments} />

        <FontAwesome
          name="trash-o"
          size={24}
          className="ml-auto mr-1"
          onPress={() => setConfirmDeleteVisible(true)}
        />

        {saved ? (
          <FontAwesome name="bookmark" size={24} onPress={unsavePost} />
        ) : (
          <FontAwesome name="bookmark-o" size={24} onPress={savePost} />
        )}
      </XStack>

      {/* DELETE MODAL */}
      <Modal
        animationType="fade"
        transparent={false}
        presentationStyle="formSheet"
        visible={confirmDeleteVisible}
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <YStack
          padding={24}
          gap={12}
          flex={1}
          alignContent="center"
          justifyContent="center"
        >
          <Text>
            Posted by {post.user.username} at{" "}
            {new Date(post.created_at).toLocaleString()}
          </Text>
          <AdvancedImage
            cldImg={image}
            style={{ aspectRatio: 1, width: "100%", backgroundColor: "black" }}
          ></AdvancedImage>

          <Text>
            Are you sure you want to delete this post?
            <Text fontStyle="italic">This action is irreversible.</Text>
          </Text>

          <XStack display="flex" gap={12}>
            <Button flexGrow={1} onPress={() => setConfirmDeleteVisible(false)}>
              Cancel
            </Button>

            <Button theme={"accent"} flexGrow={1} onPress={deletePost}>
              Delete
            </Button>
          </XStack>
        </YStack>
      </Modal>

      {/* COMMENTS MODAL */}
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
