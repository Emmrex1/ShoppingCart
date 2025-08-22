
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser, getUser } from "@/service/authService";
import { Button } from "./ui/button";

const UserMenu = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateUser = () => {
      const userData = getUser();
      setUser(userData);
      setLoading(false);
    };
    updateUser();

    const handleAuthChange = () => {
      updateUser();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 bg-shop_light_green text-white rounded-md hover:bg-shop_dark_green transition text-sm"
      >
        Sign In
      </Link>
    );
  }

  // Get first letter from name or email
  const getFirstLetter = () => {
    if (user.name) return user.name[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return "U";
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none avatar-container"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || "User"}
            className="w-8 h-8 rounded-full border border-gray-300 object-cover hover:ring-2 hover:ring-shop_light_green transition user-avatar"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-shop_light_green text-white flex items-center justify-center font-medium border border-gray-300 hover:ring-2 hover:ring-shop_dark_green transition">
            {getFirstLetter()}
          </div>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <Link
              href="/orders"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Orders
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/wishlist"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Wishlist
            </Link>
            <button
              onClick={() => {
                logoutUser();
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;