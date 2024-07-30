import React from "react";
import PostCard from "./PostCard";
import { PostType } from "@/types/PostType";

interface DisplayPostsProps {
  posts: PostType[];
}

export default function DisplayPosts({ posts }: DisplayPostsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {posts.map((post) => (
        <PostCard key={post.postId} {...post} />
      ))}
    </div>
  );
}
