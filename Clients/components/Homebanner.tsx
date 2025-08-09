import React from "react";
import Link from "next/link";
import Image from "next/image";
import { banner_1 } from "@/images";
import { Title } from "./ui/text";

const HomeBanner = () => {
  return (
    <section className="bg-shop_light_pink rounded-xl px-6 py-10 md:px-12 lg:px-24 mt-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 ">
        {/* Text Section: Always Visible */}
        <div className="text-center md:text-left space-y-6 max-w-xl">
          <Title className="text-2xl md:text-3xl lg:text-4xl leading-tight font-bold text-shop_dark_green">
            Grab Up to <span className="text-shop_dark_green/90">50% Off</span> <br />
            on Selected Headphones!
          </Title>

          <p className="text-shop_dark_green/80 text-sm md:text-base">
            Discover top-quality headphones at unbeatable prices. Limited time offer, shop now!
          </p>

          <Link href="/shop">
            <span className="inline-block bg-shop_dark_green text-white px-6 py-3 rounded-md text-sm md:text-base font-semibold transition duration-300 hover:bg-shop_dark_green/90 hover:shadow-lg">
              Shop Now
            </span>
          </Link>
        </div>

        {/* Image Section: Hidden on Mobile */}
        <div className="hidden md:block w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <Image
            src={banner_1}
            alt="Promotional Headphones Banner"
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
