"use client";
import React, { useEffect, useState } from "react";
import { firestore } from "../../../../lib/firebaseConfig";
import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import ProfileData from "../../../components/ProfileData";
import DisplayPosts from "../../../components/DisplayPosts";
import { ProfileType } from "@/types/Profile";
import { PostType } from "@/types/PostType";
import { FaRegSadCry } from "react-icons/fa";

interface PageProps {
  params: {
    username: string;
  };
}

export default function UserProfile({ params }: PageProps) {
  const { username } = params;
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      const fetchProfile = async () => {
        const q = query(
          collection(firestore, "users"),
          where("username", "==", username)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setProfile({
            uid: userDoc.id,
            username: userData.username,
            profilePicUrl: userData.profilePicUrl,
            bio: userData.bio,
            followers: userData.followers,
            followersList: userData.followersList,
            following: userData.following,
            followingList: userData.followingList,
            posts: userData.posts,
            numOfPosts: userData.numOfPosts,
            otherUser: true,
          });
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [username]);

  useEffect(() => {
    if (profile?.posts) {
      const fetchPosts = async () => {
        const fetchedPosts: PostType[] = [];
        for (const postId of profile.posts) {
          const postRef = doc(firestore, "posts", postId);
          const postSnap = await getDoc(postRef);
          if (postSnap.exists()) {
            fetchedPosts.push({
              postId: postSnap.id,
              ...postSnap.data(),
            } as PostType);
          }
        }
        setPosts(fetchedPosts);
      };
      fetchPosts();
    }
  }, [profile]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full">
      <div className="bg-opacity-50 rounded-lg flex flex-col w-full">
        {profile && <ProfileData {...profile} />}
        <hr className="my-4 border-gray-600" />
        <div className="w-full">
          {posts.length ? (
            <DisplayPosts posts={posts} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <FaRegSadCry className="text-6xl text-gray-600 mb-4" />
              <p className="text-gray-600 text-xl">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
