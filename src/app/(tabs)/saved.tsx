import { FlatList, GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { FocusOn } from "@cloudinary/transformation-builder-sdk/qualifiers/focusOn";
import { focusOn } from "@cloudinary/transformation-builder-sdk/qualifiers/gravity";
import { cld } from "~/src/lib/cloudinary";
import { useAuth } from "~/src/providers/AuthProvider";
import { useCallback, useEffect, useState } from "react";
import { Alert, useWindowDimensions } from "react-native";
import { CloudinaryImage } from "@cloudinary/url-gen/index";
import { PostData, UserDataSimple } from "~/src/lib/types";
import { supabase } from "~/src/lib/supabase";
import { AdvancedImage } from "cloudinary-react-native";
import PostSquare from "~/src/components/PostSquare";

export default function SavedPostsScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostData[]>();

  const { width, height } = useWindowDimensions();

  const [postAvatar, setPostAvatar] = useState<CloudinaryImage>();

  const [user, setUser] = useState<UserDataSimple>();

  const fetchAvatar = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        Alert.alert("Something unexpected happened.");
        throw error;
      }

      const AVATAR_W = 96;
      const postAvatarTemp = cld.image(data.avatar_url);
      postAvatarTemp.resize(
        thumbnail()
          .width(AVATAR_W)
          .height(AVATAR_W)
          .gravity(focusOn(FocusOn.face()))
      );
      setPostAvatar(postAvatarTemp);

      setUser(data);
    } finally {
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("post_saves")
        .select("*, post:posts(*, user:profiles(*))")
        .eq("user_id", userId);

      if (error || !data) {
        Alert.alert(error.message);
        throw error;
      }

      setPosts(data.map(item => item.post));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
    fetchAvatar();
  }, []);

  const [postRefreshCnt, setPostRefreshCnt] = useState(0);
  const [refreshingPosts, setRefreshingPosts] = useState(false);

  const onRefreshPosts = useCallback(async () => {
    if (refreshingPosts) return;
    setRefreshingPosts(true);
    await fetchPosts();
    setRefreshingPosts(false);
    setPostRefreshCnt(postRefreshCnt + 1);
  }, [refreshingPosts]);

  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchPosts();
    await fetchAvatar();
    setRefreshing(false);
    setPostRefreshCnt(postRefreshCnt + 1);
  }, [refreshing]);

  return (
    <GestureHandlerRootView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <YStack>
          <XStack padding={25} paddingBottom={15} gap={10} marginBlock={20}>
            {postAvatar && (
              <AdvancedImage
                cldImg={postAvatar}
                width={96}
                style={{ aspectRatio: 1, backgroundColor: "black" }}
                borderRadius={Number.MAX_SAFE_INTEGER}
              ></AdvancedImage>
            )}
            <YStack gap={2}>
              <Text fontWeight={"bold"} fontSize={24}>
                {user?.username}
              </Text>
              <Text fontSize={16}>{user?.description}</Text>
            </YStack>
          </XStack>

          <View width={"90%"} opacity={0.3} borderTopWidth={1} margin={"auto"} marginBottom={25}></View>

          <Text fontSize={16} margin={"auto"} marginBottom={8} fontWeight={"bold"}>
            Saved Posts
          </Text>
          <FlatList
            data={posts}
            numColumns={3}
            keyExtractor={(post) => post.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <PostSquare
                post={item}
                sideLength={width / 3}
                onRefresh={onRefreshPosts}
                refreshCnt={postRefreshCnt}
              ></PostSquare>
            )}
          ></FlatList>
        </YStack>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
