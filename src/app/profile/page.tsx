"use client";
import React, { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth"; // Adjust the import path as needed
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../lib/firebaseConfig";
import ProfileData from "../../components/ProfileData";
import { ProfileType } from "@/types/Profile";
import DisplayPosts from "@/components/DisplayPosts";
import { PostType } from "@/types/PostType";
import { FaRegSadCry } from "react-icons/fa";

export default function Profile() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as ProfileType);
        }
      };
      fetchProfile();
    }
  }, [user]);

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
      </div>
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
  );
}
