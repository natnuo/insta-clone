import { Image, ScrollView, Text, XStack, YStack } from "tamagui";
import posts from "~/assets/data/posts.json";
import PostListItem from "~/src/components/PostListItem";

export default function ForYouScreen() {
    return (
        <ScrollView>
            {posts.map((post, ix) => {
                console.log(post.image_url);
                return <PostListItem post={post} key={`post${ix}`}></PostListItem>;
            })}
        </ScrollView>
    );
}
