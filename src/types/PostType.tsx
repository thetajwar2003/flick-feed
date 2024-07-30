export type PostType = {
  postId: string;
  username: string;
  profilePicUrl: string;
  uploadDate: Date;
  imageUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  mostRecentComment: any;
  allComments: any[];
};
