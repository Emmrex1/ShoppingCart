"use client";

import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import CartIcon from "./CartIcon";
import MobileMenu from "./MobileMenu";
import Searchbar from "./Searchbar";
import FavoriteButton from "./Favouritebutton";

import dynamic from "next/dynamic";
const UserMenu = dynamic(() => import("./UserMenu"), { ssr: false });

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <Container className="flex items-center justify-between py-3 md:py-4 text-lightColor">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Mobile menu button only on small screens */}
          <div className="md:hidden mt-2">
            <MobileMenu />
          </div>
          <Logo />
        </div>

        {/* Middle: Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <HeaderMenu />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Searchbar hidden on small screens */}
          <div className="hidden md:block">
            <Searchbar />
          </div>
          <CartIcon />
          <FavoriteButton />
          <UserMenu />
        </div>
      </Container>
    </header>
  );
};

export default Header;
