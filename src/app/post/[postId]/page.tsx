"use client";
import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "../../../../lib/firebaseConfig";
import Image from "next/image";
import { FaHeart, FaComment } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";
import { timeAgo } from "../../../../utils/convertTime"; // Ensure you have this utility function

interface Comment {
  username: string;
  text: string;
  timestamp: string;
  profilePicUrl: string;
}

interface PostType {
  postId: string;
  username: string;
  profilePicUrl: string;
  uploadDate: Date;
  imageUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  mostRecentComment: Comment | null;
  comments: Comment[];
  likedBy: string[];
}

interface PageProps {
  params: {
    postId: string;
  };
}

export default function PostPage({ params }: PageProps) {
  const { postId } = params;
  const { user } = useAuth();
  const [post, setPost] = useState<PostType | null>(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        const postRef = doc(firestore, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          setPost({ postId: postSnap.id, ...postSnap.data() } as PostType);
        }
        setLoading(false);
      };
      fetchPost();
    }
  }, [postId]);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user && post) {
        const likedBy = post.likedBy || [];
        if (likedBy.includes(user.uid)) {
          setLiked(true);
        }
      }
    };
    checkIfLiked();
  }, [user, post]);

  const handleAddComment = async () => {
    if (user && post) {
      // Fetch user details from Firestore
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();

        const comment: Comment = {
          username: userData.username,
          text: newComment,
          timestamp: new Date().toISOString(), // Add timestamp to the comment
          profilePicUrl: userData.profilePicUrl || "", // Add profilePicUrl from the user object
        };

        const postRef = doc(firestore, "posts", post.postId);
        await updateDoc(postRef, {
          comments: arrayUnion(comment),
          commentsCount: post.commentsCount + 1,
          mostRecentComment: comment,
        });

        setPost((prevPost) => {
          if (prevPost) {
            return {
              ...prevPost,
              comments: [...prevPost.comments, comment],
              commentsCount: prevPost.commentsCount + 1,
              mostRecentComment: comment,
            };
          }
          return prevPost;
        });
        setNewComment("");
      }
    }
  };

  const handleLike = async () => {
    if (user && post) {
      const postRef = doc(firestore, "posts", post.postId);
      if (liked) {
        await updateDoc(postRef, {
          likedBy: arrayRemove(user.uid),
          likes: post.likes - 1,
        });
        setPost((prevPost) => {
          if (prevPost) {
            return {
              ...prevPost,
              likedBy: prevPost.likedBy.filter((uid) => uid !== user.uid),
              likes: prevPost.likes - 1,
            };
          }
          return prevPost;
        });
      } else {
        await updateDoc(postRef, {
          likedBy: arrayUnion(user.uid),
          likes: post.likes + 1,
        });
        setPost((prevPost) => {
          if (prevPost) {
            return {
              ...prevPost,
              likedBy: [...prevPost.likedBy, user.uid],
              likes: prevPost.likes + 1,
            };
          }
          return prevPost;
        });
      }
      setLiked(!liked);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full p-4">
      {post && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden my-4">
          <div className="flex items-center px-4 py-2">
            <Image
              className="h-12 w-12 rounded-full object-cover"
              src={post.profilePicUrl}
              alt={post.username}
              width={48}
              height={48}
            />
            <div className="mx-3">
              <h2 className="text-xl font-semibold text-gray-800">
                {post.username}
              </h2>
              <p className="text-gray-600">
                {new Date(post.uploadDate).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="relative w-full" style={{ paddingBottom: "100%" }}>
            <Image
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={post.imageUrl}
              alt={post.caption}
              layout="fill"
            />
          </div>
          <div className="px-4 py-2">
            <p className="text-gray-700">{post.caption}</p>
            <div className="flex items-center mt-2">
              <FaHeart
                className={`cursor-pointer ${
                  liked ? "text-red-600" : "text-gray-300"
                }`}
                onClick={handleLike}
              />
              <span className="text-gray-600 ml-1">{post.likes}</span>
            </div>
            <hr className="my-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Comments
              </h3>
              {post.comments.map((comment, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center">
                    <Image
                      className="h-8 w-8 rounded-full object-cover"
                      src={comment.profilePicUrl}
                      alt={comment.username}
                      width={32}
                      height={32}
                    />
                    <div className="ml-2">
                      <p className="text-gray-800 font-semibold">
                        {comment.username}
                      </p>
                      <p className="text-gray-600">{comment.text}</p>
                      <p className="text-gray-500 text-sm">
                        {timeAgo(new Date(comment.timestamp))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
                placeholder="Add a comment..."
              />
              <button
                onClick={handleAddComment}
                className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
