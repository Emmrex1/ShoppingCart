// components/CategoryProducts.tsx
"use client";

import { Category, Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface Props {
  categories: Category[];
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  const fetchProducts = async (categorySlug: string) => {
    setLoading(true);
    try {
      const query = `
        *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc){
          ..., "categories": categories[]->title
        }
      `;
      const data = await client.fetch(query, { categorySlug });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug]); // ✅ fixed dependency

  return (
    <div className="flex flex-col md:flex-row gap-8 py-6">
      {/* Sidebar */}
      <div className="w-full md:w-52 border rounded-md overflow-hidden bg-white shadow-sm">
        {categories?.map((item) => {
          const isActive = item?.slug?.current === currentSlug;
          return (
            <Button
              key={item?._id}
              onClick={() => item?.slug?.current && handleCategoryChange(item.slug.current)}
              className={`w-full justify-start px-4 py-3 text-left rounded-none font-semibold capitalize text-sm transition-colors duration-200
                ${isActive ? "bg-shop_orange text-white" : "hover:bg-gray-100 text-gray-800"}`}
              variant="ghost"
            >
              {item?.title}
            </Button>
          );
        })}
      </div>

      {/* Products */}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-gray-100 rounded-md">
            <div className="flex items-center space-x-3 text-shop_orange animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium text-base">Loading products...</span>
            </div>
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {products.map((product: Product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <NoProductAvailable selectedTab={currentSlug} className="w-full" />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
