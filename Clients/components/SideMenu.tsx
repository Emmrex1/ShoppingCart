"use client";

import React, { FC, useEffect } from "react";
import ReactDOM from "react-dom";
import Logo from "./Logo";
import { X } from "lucide-react";
import { headerData } from "./constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [pathname]);

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-[101] w-full max-w-xs bg-black text-white/70 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <Logo className="text-white" spanDesign="group-hover:text-white" />
            <button
              onClick={onClose}
              className="hover:text-shop_light_green transition-colors p-2 rounded-full focus:outline-none"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
            {headerData.map((item) => (
              <Link
                href={item.href}
                key={item.title}
                className={`hover:text-shop_light_green hoverEffect text-lg ${
                  pathname === item.href ? "text-white" : ""
                }`}
                onClick={onClose}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="mt-auto">
            <SocialMedia />
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default SideMenu;