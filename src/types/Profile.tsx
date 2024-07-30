export type ProfileType = {
  uid: string;
  username: string;
  profilePicUrl: string;
  bio: string;
  followers: number;
  followersList: string[]; // Array of user IDs
  following: number;
  followingList: string[]; // Array of user IDs
  numOfPosts: number;
  posts: string[];
  otherUser?: boolean;
};
