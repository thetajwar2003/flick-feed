"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";

export default function Header() {
  const [user, setUser] = useState(false);
  return (
    <header className="text-gray-100 body-font border-b-2 border-gray-300">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          href="/"
          className="flex title-font font-medium items-center text-gray-100 mb-4 md:mb-0"
        >
          <span className="ml-3 text-xl">Flick Feed</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/" className="mr-5 hover:text-gray-900 ">
            Home
          </Link>
          <Link href="/search" className="mr-5 hover:text-gray-900 ">
            Search
          </Link>
        </nav>
        {user ? (
          <Link
            href="/profile"
            className="inline-flex items-center bg-gray-600 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
          >
            Profile
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center bg-gray-600 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
          >
            Login <FaArrowRight className="ml-1" />
          </Link>
        )}
      </div>
    </header>
  );
}
