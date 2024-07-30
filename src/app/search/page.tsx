"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "../../../lib/firebaseConfig";
import useAuth from "@/hooks/useAuth"; // Adjust the import path as needed

interface User {
  id: string;
  username: string;
  profilePicUrl: string;
}

export default function Search() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<string[]>([]); // List of user IDs the current user is following

  useEffect(() => {
    const fetchFollowing = async () => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFollowing(userSnap.data().followingList || []);
        }
      }
    };
    fetchFollowing();
  }, [user]);

  const handleSearch = async () => {
    if (!searchTerm) {
      setFilteredUsers([]);
      return;
    }

    try {
      const usersRef = collection(firestore, "users");
      const q = query(
        usersRef,
        where("username", ">=", searchTerm),
        where("username", "<=", searchTerm + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const results: User[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as User);
      });
      setFilteredUsers(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleFollow = async (userId: string) => {
    if (user) {
      const userRef = doc(firestore, "users", user.uid);
      const profileRef = doc(firestore, "users", userId);
      try {
        if (following.includes(userId)) {
          // Unfollow
          await updateDoc(userRef, {
            followingList: arrayRemove(userId),
          });
          await updateDoc(profileRef, {
            followersList: arrayRemove(user.uid),
          });
          setFollowing((prev) => prev.filter((id) => id !== userId));
        } else {
          // Follow
          await updateDoc(userRef, {
            followingList: arrayUnion(userId),
          });
          await updateDoc(profileRef, {
            followersList: arrayUnion(user.uid),
          });
          setFollowing((prev) => [...prev, userId]);
        }
      } catch (error) {
        console.error("Error updating follow status:", error);
      }
    }
  };

  return (
    <div className="bg-opacity-50 rounded-lg flex flex-col w-full mx-4">
      <h2 className="text-white text-lg font-medium title-font mb-5">
        Search Users
      </h2>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
        />
        <button
          onClick={handleSearch}
          className="mt-4 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          Search
        </button>
      </div>
      <div className="bg-opacity-50 rounded-lg flex flex-col w-full mx-4 mt-10">
        <h2 className="text-white text-lg font-medium title-font mb-5">
          Results
        </h2>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-gray-700 bg-opacity-75 rounded-lg p-4 mb-4 w-full"
            >
              <div className="flex items-center">
                <Image
                  className="rounded-full object-cover"
                  src={user.profilePicUrl}
                  alt={user.username}
                  width={50}
                  height={50}
                />
                <span className="ml-4 text-white text-lg">{user.username}</span>
              </div>
              <button
                onClick={() => handleFollow(user.id)}
                className={`text-white border-0 py-2 px-4 focus:outline-none rounded text-lg ${
                  following.includes(user.id)
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {following.includes(user.id) ? "Following" : "Follow"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No users found.</p>
        )}
      </div>
    </div>
  );
}
