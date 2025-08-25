"use client";

import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import React, { useEffect, useState } from "react";
import { getUser } from "@/service/authService";

interface User {
  id: string;
  email: string;
  name?: string;
}

const WishListPage = () => {
  const [user, setUser] = useState<User | null>(null); // ✅ no more `any`
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUser() as User | null;
    setUser(userData);
    setLoading(false);

    const handleAuthChange = () => {
      setUser(getUser() as User | null);
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
