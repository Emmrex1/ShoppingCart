// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image"; 

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   imageUrl: string;
// }

// export default function CartPage() {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) {
//       setCart(JSON.parse(storedCart));
//     }
//   }, []);

//   const removeItem = (id: string) => {
//     const updated = cart.filter((item) => item.id !== id);
//     setCart(updated);
//     localStorage.setItem("cart", JSON.stringify(updated));
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <ul className="space-y-4">
//           {cart.map((item) => (
//             <li
//               key={item.id}
//               className="flex justify-between items-center border p-4 rounded-md"
//             >
//               <div className="flex items-center space-x-4">
//                 <Image
//                   src={item.imageUrl}
//                   alt={item.name}
//                   width={64}
//                   height={64}
//                   className="rounded-md object-cover"
//                 />
//                 <div>
//                   <p className="font-semibold">{item.name}</p>
//                   <p className="text-sm text-gray-500">
//                     {item.quantity} × ${item.price}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => removeItem(item.id)}
//                 className="text-red-600 hover:underline"
//               >
//                 Remove
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

"use client";

import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUser } from "@/service/authService";
import NoAccess from "@/components/NoAccess";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());

  const [user, setUser] = useState<any | null>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Handle auth state changes
  useEffect(() => {
    // Initial user fetch
    const currentUser = getUser();
    setUser(currentUser);

    // Listen for auth state changes
    const handleAuthChange = () => {
      const updatedUser = getUser();
      setUser(updatedUser);
    };

    window.addEventListener("authChange", handleAuthChange);
    
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);


 const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0])
      }
    } catch (error) {
      console.log("Addresses fetching error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, []);
  


  const confirmReset = () => {
    resetCart();
    setIsResetDialogOpen(false);
    toast.success("Cart reset successfully");
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("You must be logged in to checkout");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.name ?? "Unknown",
        customerEmail: user?.email ?? "Unknown",
        customerId: user?.id,
        address: selectedAddress,
      };
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to create checkout session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {user ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Shopping Cart</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                {/* Cart items */}
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems?.map(({ product }) => {
                      const itemCount = getItemCount(product?._id);
                      return (
                        <div
                          key={product?._id}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                              >
                                <Image
                                  src={urlFor(product?.images[0]).url()}
                                  alt="productImage"
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product?.name}
                                </h2>
                                <p className="text-sm capitalize">
                                  Variant:{" "}
                                  <span className="font-semibold">
                                    {product?.variant}
                                  </span>
                                </p>
                                <p className="text-sm capitalize">
                                  Status:{" "}
                                  <span className="font-semibold">
                                    {product?.status}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <ProductSideMenu
                                        product={product}
                                        className="relative top-0 right-0"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Add to Favorite
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() => {
                                          deleteCartProduct(product?._id);
                                          toast.success(
                                            "Product deleted successfully!"
                                          );
                                        }}
                                        className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Delete product
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter
                              amount={(product?.price as number) * itemCount}
                              className="font-bold text-lg"
                            />
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      );
                    })}

                    {/* Reset cart dialog */}
                    <Dialog
                      open={isResetDialogOpen}
                      onOpenChange={setIsResetDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="mb-5 font-semibold"
                          variant="destructive"
                          size="lg"
                        >
                          Reset Cart
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reset Cart</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to reset your cart? This action
                            cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsResetDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={confirmReset}>
                            Yes, Reset
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Right column - Order summary & addresses */}
                <div>
                  <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">
                      Order Summary
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>SubTotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <Button
                        className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                        size="lg"
                        disabled={loading || !selectedAddress}
                        onClick={handleCheckout}
                      >
                        {loading 
                          ? "Processing..." 
                          : selectedAddress 
                            ? "Proceed to Checkout" 
                            : "Select Address"}
                      </Button>
                    </div>
                  </div>

                  {user && addresses && (
                    <div className="bg-white rounded-md mt-5">
                      <Card>
                        <CardHeader>
                          <CardTitle>Delivery Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RadioGroup
                            value={selectedAddress?._id}
                            onValueChange={(value) => {
                              const addr = addresses.find(a => a._id === value);
                              if (addr) setSelectedAddress(addr);
                            }}
                          >
                            {addresses?.map((address) => (
                              <div
                                key={address?._id}
                                className={`flex items-center space-x-2 mb-4 cursor-pointer ${
                                  selectedAddress?._id === address?._id &&
                                  "text-shop_dark_green"
                                }`}
                              >
                                <RadioGroupItem
                                  value={address._id}
                                  id={`address-${address._id}`}
                                />
                                <Label
                                  htmlFor={`address-${address._id}`}
                                  className="grid gap-1.5 flex-1"
                                >
                                  <span className="font-semibold">
                                    {address?.name}
                                  </span>
                                  <span className="text-sm text-black/60">
                                    {address.address}, {address.city},{" "}
                                    {address.state} {address.zip}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          <Button variant="outline" className="w-full mt-4">
                            Add New Address
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Mobile order summary */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="bg-white p-4 rounded-lg border mx-4">
                    <h2>Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>SubTotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <Button
                        className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                        size="lg"
                        disabled={loading || !selectedAddress}
                        onClick={handleCheckout}
                      >
                        {loading 
                          ? "Processing..." 
                          : selectedAddress 
                            ? "Proceed to Checkout" 
                            : "Select Address"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartPage;