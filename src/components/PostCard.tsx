"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaHeart, FaComment } from "react-icons/fa";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "../../lib/firebaseConfig";
import { timeAgo } from "../../utils/convertTime";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

interface Comment {
  username: string;
  text: string;
  timestamp: string;
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
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user) {
        const postRef = doc(firestore, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists() && postSnap.data().likedBy?.includes(user.uid)) {
          setLiked(true);
        }
      }
    };
    checkIfLiked();
  }, [user, postId]);

  const handleLike = async () => {
    if (!user) return;
    const postRef = doc(firestore, "posts", postId);
    if (liked) {
      await updateDoc(postRef, {
        likedBy: arrayRemove(user.uid),
      });
      setLikeCount(likeCount - 1);
    } else {
      await updateDoc(postRef, {
        likedBy: arrayUnion(user.uid),
      });
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden my-4">
      <Link
        href={`profile/${username}`}
        className="flex items-center px-4 py-2"
      >
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
      </Link>
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
            <span className="text-gray-600 ml-1">{likeCount}</span>
          </div>

          <Link href={`/post/${postId}`} className="flex items-center ml-2">
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
        <Link
          href={`/post/${postId}`}
          className=" text-gray-800 hover:text-blue-500 "
        >
          View All Comments
        </Link>
      </div>
    </div>
  );
}
