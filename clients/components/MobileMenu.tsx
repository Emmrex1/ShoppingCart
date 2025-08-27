"use client";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const SideMenu = dynamic(() => import("./SideMenu"), { ssr: false });

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden hover:text-darkColor transition-colors focus:outline-none"
        aria-label="Open menu"
      >
        <GiHamburgerMenu size={24} className="md:hidden" />
      </button>
      <SideMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default MobileMenu;