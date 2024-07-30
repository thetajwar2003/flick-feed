"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "../../lib/firebaseConfig"; // Adjust the import path as needed
import DisplayPosts from "../components/DisplayPosts";
import { PostType } from "@/types/PostType";

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(firestore, "posts");
      const postsQuery = query(postsCollection, orderBy("uploadDate", "desc"));
      const postsSnapshot = await getDocs(postsQuery);

      const fetchedPosts = postsSnapshot.docs.map((doc) => ({
        postId: doc.id,
        ...doc.data(),
      })) as PostType[];

      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, []);

  const handleCreatePostClick = () => {
    router.push("/create-post");
  };

  return (
    <main>
      <div className="w-full p-4">
        <button
          onClick={handleCreatePostClick}
          className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 mb-4"
        >
          Create Post
        </button>
        <DisplayPosts posts={posts} />
      </div>
    </main>
  );
}
