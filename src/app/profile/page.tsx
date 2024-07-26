"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import mockPosts from "../../../mock/posts";
import PostCard from "@/components/PostCard";

interface ProfileProps {
  username: string;
  profilePicUrl: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
}

const initialProfile: ProfileProps = {
  username: "johndoe",
  profilePicUrl: "https://picsum.photos/200",
  bio: "Just another user.",
  followers: 150,
  following: 200,
  posts: mockPosts.length,
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileProps>(initialProfile);
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    // Handle save logic here
    setEditMode(false);
    console.log("Profile updated:", profile);
  };

  return (
    <div>
      <div className="bg-opacity-50 rounded-lg flex flex-col w-full">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-lg font-medium title-font">
            Your Profile
          </h2>
          <button
            className="text-white bg-indigo-500 border-0 py-1 px-4 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="flex items-center mb-4 w-full">
          <Image
            className="rounded-full object-cover"
            src={profile.profilePicUrl}
            alt={profile.username}
            width={100}
            height={100}
          />
          {editMode && (
            <label className="ml-4 bg-gray-800 p-2 rounded-full cursor-pointer">
              <FaEdit className="text-white" />
              <input type="file" className="hidden" />
            </label>
          )}
          <div className="ml-4">
            <h2 className="text-white text-2xl font-semibold">
              {profile.username}
            </h2>
            <div className="text-gray-400 flex space-x-2">
              <span>{profile.posts} Posts</span>
              <span>•</span>
              <span>{profile.followers} Followers</span>
              <span>•</span>
              <span>{profile.following} Following</span>
            </div>
          </div>
        </div>
        <div className="relative mb-4">
          <label htmlFor="bio" className="leading-7 text-sm text-gray-400">
            Bio
          </label>
          {editMode ? (
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              className={`w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
              disabled={!editMode}
            />
          ) : (
            <p>{profile.bio}</p>
          )}
        </div>
        {editMode && (
          <button
            onClick={handleSave}
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          >
            Save
          </button>
        )}
      </div>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {mockPosts.map((post) => (
            <PostCard key={post.postId} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
