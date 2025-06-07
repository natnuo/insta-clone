export type PostData = {
  id: string,
  created_at: string,
  image: string,
  caption: string,
  user: UserDataSimple
};
export type CommentData = {
  id: string;
  post_id?: string;
  user: UserDataSimple;
  text: string;
};
export type UserDataSimple = {
  id: string;
  updated_at: Date;
  username: string;
  avatar_url: string;
  description: string;
};
