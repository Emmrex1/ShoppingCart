"use client";
import { AlignLeft } from "lucide-react";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const SideMenu = dynamic(() => import("./SideMenu"), { ssr: false });

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden hover:text-darkColor transition-colors"
      >
        <AlignLeft />
      </button>
      <SideMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default MobileMenu;
