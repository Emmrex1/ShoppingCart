import { getAllBrands, getCategories } from "@/sanity/queries";
import React, { Suspense } from "react";
import Shop from "@/components/Shop";
import { FaSpinner } from "react-icons/fa";

const ShopPage = async () => {
  const categories = await getCategories();
  const brands = await getAllBrands();

  return (
    <div className="bg-white">
      <Suspense fallback={ <FaSpinner className="animate-spin text-blue-500 text-3xl mb-4" />}>
        <Shop categories={categories} brands={brands} />
      </Suspense>
    </div>
  );
};

export default ShopPage;
