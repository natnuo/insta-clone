import { Cloudinary } from "@cloudinary/url-gen";
import { upload } from "cloudinary-react-native";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params";

export const cld = new Cloudinary({
    cloud: {
        cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
});

export const uploadImage = async (image: string | undefined) => {
    if (!image) return;

    const options = {
        upload_preset: "post_upload",
        unsigned: true,
    };

    return new Promise<UploadApiResponse>(async (resolve, reject) => {
        await upload(cld, {
            file: image,
            options,
            callback: (error: UploadApiErrorResponse | undefined, response: UploadApiResponse | undefined) => {
                if (error || !response) {
                    reject(error);
                } else {
                    resolve(response);
                }
            }
        });
    });
};
