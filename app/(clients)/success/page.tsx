"use client";

import useStore from "@/store";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Home,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

const SuccessPageContent = () => {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    if (orderNumber) {
      resetCart();
    }
  }, [orderNumber, resetCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-white via-slate-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white max-w-xl w-full rounded-3xl p-8 shadow-xl border border-gray-200"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 12 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-10 h-10" />
          </div>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
          Thank You for Your Order!
        </h1>

        <p className="text-center text-gray-700 mb-2">
          We’ve received your order and will start processing it shortly.
        </p>
        <p className="text-center text-gray-700 mb-6">
          A confirmation email has been sent to you.
        </p>

        {orderNumber && (
          <p className="text-center text-sm text-gray-600 mb-6">
            Order Number:{" "}
            <span className="font-medium text-gray-900">{orderNumber}</span>
          </p>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition duration-300 shadow"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>

          <Link
            href="/orders"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-gray-800 border-gray-300 bg-white hover:bg-gray-100 transition duration-300 shadow"
          >
            <PackageSearch className="w-5 h-5" />
            Orders
          </Link>

          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:brightness-110 transition duration-300 shadow"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop More
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;
