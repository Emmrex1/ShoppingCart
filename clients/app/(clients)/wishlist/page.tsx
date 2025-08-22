"use client";

import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import React, { useEffect, useState } from "react";
import { getUser } from "@/service/authService";

const WishListPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth on client side
    const userData = getUser();
    setUser(userData);
    setLoading(false);
    
    // Listen for auth changes
    const handleAuthChange = () => {
      setUser(getUser());
    };
    
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      {user ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Log in to view your wishlist items. Don't miss out on your favorite products!" />
      )}
    </>
  );
};

export default WishListPage;