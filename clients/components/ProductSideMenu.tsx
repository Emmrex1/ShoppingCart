// components/ProductSideMenu.tsx
"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";
import useStore from "@/store";

interface ProductSideMenuProps {
  product: Product;
  className?: string;
}

const ProductSideMenu = ({ product, className }: ProductSideMenuProps) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const exists = favoriteProduct?.some((item) => item._id === product._id) ?? false;
    setIsFavorited(exists);
  }, [product, favoriteProduct]);

  const handleFavorite = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    try {
      await addToFavorite(product);
      toast.success(isFavorited ? "Product removed from favorites!" : "Product added to favorites!");
    } catch {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className={cn("absolute top-2 right-2", className)}>
      <div
        onClick={handleFavorite}
        className={cn(
          "p-2.5 rounded-full transition-colors hover:bg-shop_dark_green/80 hover:text-white",
          isFavorited ? "bg-shop_dark_green/80 text-white" : "bg-lightColor/10 text-black"
        )}
        role="button"
        aria-label="Toggle favorite"
      >
        <Heart size={15} />
      </div>
    </div>
  );
};

export default ProductSideMenu;
