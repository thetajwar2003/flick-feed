import { ProfileType } from "@/types/Profile";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { firestore, storage } from "../../lib/firebaseConfig"; // Adjust the import path as needed
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useAuth from "@/hooks/useAuth"; // Adjust the import path as needed

export default function ProfileData(profile: ProfileType) {
  const [editProfile, setEditProfile] = useState<ProfileType>(profile);
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(
    profile.followersList.includes(user?.uid || "")
  );
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (user) {
      try {
        let profilePicUrl = editProfile.profilePicUrl;

        // If a new profile picture is selected, upload it to Firebase Storage
        if (newProfilePic) {
          const storageRef = ref(
            storage,
            `profilePics/${user.uid}/${newProfilePic.name}`
          );
          await uploadBytes(storageRef, newProfilePic);
          profilePicUrl = await getDownloadURL(storageRef);
        }

        // Update the profile data with the new profile picture URL
        const updatedProfile = { ...editProfile, profilePicUrl };
        setEditProfile(updatedProfile);

        // Save the updated profile data to Firestore
        const docRef = doc(firestore, "users", user.uid);
        await setDoc(docRef, updatedProfile);

        setEditMode(false);
        console.log("Profile updated:", updatedProfile);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const handleFollow = async () => {
    if (user) {
      try {
        const userRef = doc(firestore, "users", user.uid);
        const profileRef = doc(firestore, "users", profile.uid);

        if (isFollowing) {
          // Unfollow
          await updateDoc(userRef, {
            followingList: arrayRemove(profile.uid),
            following: editProfile.following - 1,
          });
          await updateDoc(profileRef, {
            followersList: arrayRemove(user.uid),
            followers: editProfile.followers - 1,
          });
          setEditProfile((prevProfile) => ({
            ...prevProfile,
            followersList: prevProfile.followersList.filter(
              (follower) => follower !== user.uid
            ),
            followers: prevProfile.followers - 1,
          }));
        } else {
          // Follow
          await updateDoc(userRef, {
            followingList: arrayUnion(profile.uid),
            following: editProfile.following + 1,
          });
          await updateDoc(profileRef, {
            followersList: arrayUnion(user.uid),
            followers: editProfile.followers + 1,
          });
          setEditProfile((prevProfile) => ({
            ...prevProfile,
            followersList: [...prevProfile.followersList, user.uid],
            followers: prevProfile.followers + 1,
          }));
        }
        setIsFollowing(!isFollowing);
      } catch (error) {
        console.error("Error updating follow status:", error);
      }
    }
  };

  return (
    <>
      <div className="bg-opacity-50 rounded-lg flex flex-col w-full">
        {!profile.otherUser && (
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
        )}
        <div className="flex items-center mb-4 w-full">
          <Image
            className="rounded-full object-cover"
            src={profilePicPreview || editProfile.profilePicUrl}
            alt={editProfile.username}
            width={100}
            height={100}
          />
          {editMode && !profile.otherUser && (
            <label className="ml-4 bg-gray-800 p-2 rounded-full cursor-pointer">
              <FaEdit className="text-white" />
              <input
                type="file"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
          )}
          <div className="ml-4">
            <h2 className="text-white text-2xl font-semibold">
              {editProfile.username}
            </h2>
            <div className="text-gray-400 flex space-x-2">
              <span>{editProfile.numOfPosts} Posts</span>
              <span>•</span>
              <span>{editProfile.followers} Followers</span>
              <span>•</span>
              <span>{editProfile.following} Following</span>
            </div>
          </div>
        </div>
        {editMode ? (
          <textarea
            id="bio"
            name="bio"
            value={editProfile.bio}
            onChange={handleInputChange}
            className={`w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
            disabled={!editMode}
          />
        ) : (
          <p>{editProfile.bio}</p>
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
      {profile.otherUser && (
        <button
          onClick={handleFollow}
          className="mt-4 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </>
  );
}
