
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    template: "%s - ShopCart Online Store",
    default: "ShopCart Online Store",
  },
  description: "In ShopCart Online Store, we have everything you need",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        {children}
         <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "#000000",
                    color: "#fff",
                  },
                }}
              />
      </body>
    </html>
  );
}
