"use client";
import React, { FC } from "react";
import Logo from "./Logo";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50 w-full bg-black/50 text-white shadow-xl 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="min-w-[18rem] max-w-96 bg-black h-screen p-6 border-r border-shop_light_green flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <Logo className="text-white" />
          <button onClick={onClose} className="hover:text-shop_light_green transition-colors">
            <X />
          </button>
        </div>
        {/* Add sidebar content here */}
      </div>
    </div>
  );
};

export default SideMenu;
