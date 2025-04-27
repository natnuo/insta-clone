import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PostListItem from "~/src/components/PostListItem";
import { supabase } from "~/src/lib/supabase";
import { _GAP, _MAX_W } from "~/src/settings";

export default function ForYouScreen() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = useCallback(async () => {
    let { data, error } = await supabase
      .from("posts")
      .select("*, user:profiles(*)"); // selects data referenced from profiles as user
    if (error || !data) {
      Alert.alert("Something went wrong.", error?.message);
      return;
    }
    setPosts(data);
  }, []);

  return (
    <GestureHandlerRootView>
    <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item}></PostListItem>}
        contentContainerStyle={{
        gap: _GAP,
        maxWidth: _MAX_W,
        width: "100%",
        alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
    ></FlatList>
    </GestureHandlerRootView>
  );
}
