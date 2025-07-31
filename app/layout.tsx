import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: {
  template: "% - shopcart Online Store",
  default: "ShopCart Online Store" 
  },

  description: "In ShopCart Online Store, everything you need is there",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
       <Header/>
        {children} 
        <Footer/> 
        </body>
       
      
    </html>
  );
}
