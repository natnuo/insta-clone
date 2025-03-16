import { Image, Text, XStack, YStack } from "tamagui";
import posts from "~/assets/data/posts.json";
import Feather from '@expo/vector-icons/Feather';
import { _GAP } from "../settings";

type PostData = (typeof posts)[0];

export default function PostListItem({ post }: { post: PostData }) {
  return (
      <YStack backgroundColor={"white"}>
          {/* Header */}
          <XStack alignItems="center" gap={_GAP} padding={_GAP}>
              <Image
                  source={{
                      uri: post.user.image_url,
                  }}
                  width={50}
                  aspectRatio={1}
                  borderRadius={Number.MAX_SAFE_INTEGER}
              ></Image>
              <Text>{post.user.username}</Text>
          </XStack>

          {/* Image */}
          <Image
              source={{
                  uri: post.image_url,
              }}
              width={"100%"}
              aspectRatio={1}
          ></Image>

          {/* Reactions */}
          <XStack gap={_GAP} padding={_GAP}>
              <Feather name="heart" size={24} />
              <Feather name="message-circle" size={24} />
              <Feather name="send" size={24} />

              <Feather name="bookmark" size={24} className="ml-auto" />
          </XStack>
      </YStack>
  );
}
