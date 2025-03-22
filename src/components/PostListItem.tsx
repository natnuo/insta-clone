import { Image, Text, XStack, YStack } from "tamagui";
import posts from "~/assets/data/posts.json";
import Feather from "@expo/vector-icons/Feather";
import { _GAP, _MAX_W } from "~/src/settings";
import { AdvancedImage } from "cloudinary-react-native";
import { cld } from "~/src/lib/cloudinary";
import { useWindowDimensions } from "react-native";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { focusOn } from "@cloudinary/transformation-builder-sdk/qualifiers/gravity";

type PostData = (typeof posts)[0];

export default function PostListItem({ post }: { post: PostData }) {
    const { width } = useWindowDimensions();
    const contWidth = Math.min(width, _MAX_W);

    const image = cld.image(post.image);
    image.resize(thumbnail().width(contWidth).height(contWidth));

    const AVATAR_W = 48;
    const avatar = cld.image(post.user.avatar_url);
    avatar.resize(thumbnail().width(AVATAR_W).height(AVATAR_W).gravity(focusOn(FocusOn.face())));

    return (
        <YStack backgroundColor={"white"}>
            {/* Header */}
            <XStack alignItems="center" gap={_GAP} padding={_GAP}>
                <AdvancedImage
                    cldImg={avatar}
                    width={AVATAR_W}
                    borderRadius={Number.MAX_SAFE_INTEGER}
                    style={{aspectRatio: 1}}
                ></AdvancedImage>
                <Text>{post.user.username}</Text>
            </XStack>

            {/* Image */}
            <AdvancedImage
                cldImg={image}
                style={{aspectRatio: 1, width: "100%"}}
            ></AdvancedImage>
            {/* <Image
                source={{
                    uri: post.image_url,
                }}
                width={"100%"}
                aspectRatio={1}
            ></Image> */}

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
