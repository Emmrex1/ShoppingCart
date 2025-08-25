import { getAllBrands, getCategories } from "@/sanity/queries";
import React, { Suspense } from "react";
import Shop from "@/components/Shop";

const ShopPage = async () => {
  const categories = await getCategories();
  const brands = await getAllBrands();

  return (
    <div className="bg-white">
      {/* ✅ Wrap Shop (client component w/ useSearchParams) inside Suspense */}
      <Suspense fallback={<p>Loading shop...</p>}>
        <Shop categories={categories} brands={brands} />
      </Suspense>
    </div>
  );
};

export default ShopPage;
