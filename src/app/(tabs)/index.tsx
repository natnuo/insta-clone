import { FlatList } from "react-native";
import posts from "~/assets/data/posts.json";
import PostListItem from "~/src/components/PostListItem";
import { _GAP } from "~/src/settings";

export default function ForYouScreen() {
    return (
        <FlatList
            data={posts}
            renderItem={({ item }) => <PostListItem post={item}></PostListItem>}
            contentContainerStyle={{ gap: _GAP }}
        ></FlatList>
    );
}
