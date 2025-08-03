import { Html } from "next/document"
import { Toaster } from "@/components/ui/sonner"


const RootLayout = ({ children}: {children: React.ReactNode}) => {
 return ( 
    <html lang="en">
           <body className="font-poppins antialiased">
            {children}
         <Toaster />
           </body>
    </html>
 )}

 export default RootLayout;
