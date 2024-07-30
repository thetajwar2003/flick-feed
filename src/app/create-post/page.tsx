"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { firestore, storage } from "../../../lib/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useAuth from "@/hooks/useAuth";
import { FaArrowLeft } from "react-icons/fa6";

export default function CreatePost() {
  const { user } = useAuth();
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUsername(userData.username);
          setProfilePicUrl(userData.profilePicUrl);
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && imageFile && username && profilePicUrl) {
      try {
        const storageRef = ref(storage, `posts/${user.uid}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);

        // Add post details to Firestore and get the document reference
        const postRef = await addDoc(collection(firestore, "posts"), {
          userId: user.uid,
          username: username,
          profilePicUrl: profilePicUrl,
          uploadDate: new Date().toISOString(),
          imageUrl,
          caption,
          likes: 0,
          commentsCount: 0,
          mostRecentComment: "",
          comments: [],
        });

        // Get the post ID from the document reference
        const postId = postRef.id;

        // Update the user's document to include the new post ID in their posts array
        const userRef = doc(firestore, "users", user.uid);
        await updateDoc(userRef, {
          posts: arrayUnion(postId),
        });

        setCaption("");
        setImageFile(null);
        setImagePreview(null);
        alert("Post created successfully");
        router.push("/"); // Navigate back to the home page
      } catch (error) {
        console.error("Error creating post:", error);
      }
    } else {
      alert("Please upload an image and fill in the caption.");
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => router.back()}
          className="text-gray-600 bg-transparent border-none cursor-pointer"
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        <h2 className="text-2xl font-semibold">Create a Post</h2>
        <div style={{ width: 48 }} /> {/* Placeholder for alignment */}
      </div>
      <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-w-full h-auto rounded"
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Enter caption"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-500 py-2 px-4 rounded hover:bg-indigo-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
