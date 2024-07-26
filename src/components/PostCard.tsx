"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaHeart, FaComment } from "react-icons/fa";
import { timeAgo } from "../../utils/convertTime";
import Link from "next/link";

interface Comment {
  username: string;
  text: string;
}

interface PostCardProps {
  postId: string;
  username: string;
  profilePicUrl: string;
  uploadDate: Date;
  imageUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  mostRecentComment: Comment;
  allComments: Comment[];
}

export default function PostCard({
  postId,
  username,
  profilePicUrl,
  uploadDate,
  imageUrl,
  caption,
  likes,
  commentsCount,
  mostRecentComment,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden my-4">
      <div className="flex items-center px-4 py-2">
        <Image
          className="h-12 w-12 rounded-full object-cover"
          src={profilePicUrl}
          alt={username}
          width={48}
          height={48}
        />
        <div className="mx-3">
          <h2 className="text-xl font-semibold text-gray-800">{username}</h2>
          <p className="text-gray-600">{timeAgo(new Date(uploadDate))}</p>
        </div>
      </div>
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        <Image
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={imageUrl}
          alt={caption}
          layout="fill"
        />
      </div>
      <div className="px-4 py-2">
        <p className="text-gray-700">{caption}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <FaHeart
              className={`cursor-pointer ${
                liked ? "text-red-600" : "text-gray-300"
              }`}
              onClick={handleLike}
            />
            <span className="text-gray-600 ml-1">{likes}</span>
          </div>

          <Link href="/post/1" className="flex items-center ml-2">
            <FaComment className="text-gray-300 hover:text-blue-400" />
            <span className="text-gray-600 ml-1">{commentsCount}</span>
          </Link>
        </div>
        {mostRecentComment && (
          <div className="mt-2">
            <p className="text-gray-800 font-semibold">
              {mostRecentComment.username}
            </p>
            <p className="text-gray-600">{mostRecentComment.text}</p>
          </div>
        )}
        <Link href="/post/1" className=" text-gray-800 hover:text-blue-500 ">
          View All Comments
        </Link>
      </div>
    </div>
  );
}
