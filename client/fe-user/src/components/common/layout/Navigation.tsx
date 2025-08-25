"use client";

import Link from "next/link";
import { UserMenu } from "./UserMenu";
import { useUser } from "@/hooks/useUser";

export const Navigation = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <nav className="flex items-center space-x-4">
        <Link
          href="/"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/subjects"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Subjects
        </Link>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-4">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <Link
          href="/"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/subjects"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Subjects
        </Link>
        <UserMenu user={user || null} />
      </div>
    </nav>
  );
};
