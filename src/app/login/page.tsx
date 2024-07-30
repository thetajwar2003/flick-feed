"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "../../../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect to home page or dashboard
    } catch (error) {
      setError("Failed to log in. Please check your email and password.");
      console.error("Error logging in", error);
    }
  };

  return (
    <div className="bg-opacity-50 rounded-lg p-8 flex flex-col w-full mx-4">
      <h1 className="text-white text-xl font-medium title-font mb-5">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="relative mb-4">
        <label htmlFor="email" className="leading-7 text-sm text-gray-400">
          Email
        </label>
        <input
          type="text"
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
      <button
        onClick={handleLogin}
        className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        Login
      </button>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
