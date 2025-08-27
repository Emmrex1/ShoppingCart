"use client";
import Link from "next/link";
import { productType } from "./constants/data";
import { Button } from "./ui/button";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTab = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      {/* Product Types */}
      <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-3 text-sm font-semibold">
        {productType?.map((item) => (
          <Button
            onClick={() => onTabSelect(item?.title)}
            key={item?.title}
            className={`border border-shop_light_green/30 px-3 py-1.5 md:px-6 md:py-2 rounded-full text-center hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect 
              ${selectedTab === item?.title
                ? "bg-shop_light_green text-white border-shop_light_green"
                : "bg-shop_light_green/10"
              }`}
          >
            {item?.title}
          </Button>
        ))}
      </div>

      {/* See all link */}
      <Link
        href={"/shop"}
        className="border border-darkColor px-4 py-1 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect mt-2 md:mt-0"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTab;
