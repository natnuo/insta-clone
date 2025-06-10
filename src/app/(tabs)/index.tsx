import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";
import { ScrollView } from "tamagui";
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
      .select("*, user:profiles(*)") // selects data referenced from profiles as user
      .order("created_at", { ascending: false });

    if (error || !data) {
      Alert.alert("Something went wrong.", error?.message);
      return;
    }
    
    setPosts(data);
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const [refreshCnt, setRefreshCnt] = useState(0);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
    setRefreshCnt(refreshCnt + 1);
  }, [refreshing]);

  return (
    <GestureHandlerRootView>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} onRefresh={onRefresh} refreshCnt={refreshCnt}></PostListItem>}
        contentContainerStyle={{
          gap: _GAP,
          maxWidth: _MAX_W,
          width: "100%",
          alignSelf: "center",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      ></FlatList>
    </GestureHandlerRootView>
  );
}
