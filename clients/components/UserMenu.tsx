"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser, getUser } from "@/service/authService";
import { Button } from "./ui/button";
import { UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const UserMenu = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // ✅ Only run auth logic on client
  useEffect(() => {
    const updateUser = () => {
      try {
        const userData = getUser(); // safe on client
        setUser(userData);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    updateUser();

    const handleAuthChange = () => updateUser();
    window.addEventListener("authChange", handleAuthChange);

    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  // ✅ Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Close menu when navigating to a new page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ✅ Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  if (loading) return null;

  if (!user) {
    return (
      <Button
        asChild
        className="flex items-center gap-2 bg-shop_light_green text-white rounded-md hover:bg-shop_dark_green transition text-sm px-4 py-2"
      >
        <Link href="/login">
          <UserIcon className="w-4 h-4 inline-block mr-1" /> Sign In
        </Link>
      </Button>
    );
  }

  const getFirstLetter = () => {
    if (user.name) return user.name[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return "U";
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 focus:outline-none bg-white avatar-container"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="User menu"
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
            role="menu"
            aria-label="User options"
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
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Orders
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/wishlist"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Wishlist
            </Link>
            <button
              onClick={() => {
                logoutUser();
                setOpen(false);
              }}
              role="menuitem"
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
