"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaEdit } from "react-icons/fa";
import Image from "next/image";
import { auth, firestore, storage } from "../../../lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>(
    "https://picsum.photos/200"
  );

  const router = useRouter();

  const handleSignUp = async () => {
    try {
      let profilePicUrl = profilePicPreview;

      if (profilePic) {
        const storageRef = ref(
          storage,
          `profilePics/${username}-${profilePic.name}`
        );
        await uploadBytes(storageRef, profilePic);
        profilePicUrl = await getDownloadURL(storageRef);
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("Sign Up Complete:", user);
      console.log("User ID:", user.uid);

      // Save user data to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        userId: user.uid,
        username,
        firstName,
        lastName,
        email,
        bio,
        profilePicUrl,
        birthdate,
        createdAt: new Date().toISOString(),
        posts: [],
        followers: 0,
        followersList: [],
        following: 0,
        followingList: [],
      });

      // Redirect or show a success message
      router.push("/");
    } catch (error) {
      console.log("Error signing up:", error);
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-opacity-50 rounded-lg p-8 flex flex-col w-full mx-4">
      <h2 className="text-white text-lg font-medium title-font mb-5">
        Sign Up
      </h2>
      <div className="relative mb-4">
        <label
          htmlFor="profile-pic"
          className="leading-7 text-sm text-gray-400"
        >
          Profile Picture
        </label>
        <div className="flex items-center">
          <Image
            className="rounded-full object-cover"
            src={profilePicPreview}
            alt="Profile Picture Preview"
            width={100}
            height={100}
          />
          <label className="ml-4 bg-gray-800 p-2 rounded-full cursor-pointer">
            <FaEdit className="text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-pic"
              onChange={handleProfilePicChange}
            />
          </label>
        </div>
      </div>
      <div className="relative mb-4">
        <label htmlFor="first-name" className="leading-7 text-sm text-gray-400">
          First Name
        </label>
        <input
          type="text"
          id="first-name"
          name="first-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div className="relative mb-4">
        <label htmlFor="last-name" className="leading-7 text-sm text-gray-400">
          Last Name
        </label>
        <input
          type="text"
          id="last-name"
          name="last-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div className="relative mb-4">
        <label htmlFor="username" className="leading-7 text-sm text-gray-400">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div className="relative mb-4">
        <label htmlFor="email" className="leading-7 text-sm text-gray-400">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div className="relative mb-4">
        <label htmlFor="password" className="leading-7 text-sm text-gray-400">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        <button
          type="button"
          className="absolute inset-y-12 right-0 pr-3 flex items-center text-gray-400"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <div className="relative mb-4">
        <label htmlFor="bio" className="leading-7 text-sm text-gray-400">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        ></textarea>
      </div>
      <div className="relative mb-4">
        <label htmlFor="birthdate" className="leading-7 text-sm text-gray-400">
          Birthdate
        </label>
        <input
          type="date"
          id="birthdate"
          name="birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <button
        onClick={handleSignUp}
        className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        Sign Up
      </button>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
