// import React from 'react'
// import Container from './Container';
// import Logo from './Logo';
// import HeaderMenu from './HeaderMenu';
// import Searchbar from './Searchbar';
// import CartIcon from './CartIcon';
// import Favouritebutton from './Favouritebutton';
// import SignIn from './SignIn';
// import MobileMenu from './MobileMenu';
// import { currentUser } from '@clerk/nextjs/server';
// import { ClerkLoaded, SignedIn, UserButton } from '@clerk/nextjs';

// const Header = async () => {
//   const user = await currentUser()
//   return (
//     <header className='bg-white py-5'> 
//       <Container className='flex justify-between items-center text-lightColor'>
//        <div className='flex w-auto md:w-1/3 items-center justify-start gap-2.5 md:gap-0 '>
//          <MobileMenu/>
//         <Logo/>
//         </div>
//         <HeaderMenu/>
//         <div className='flex w-auto md:w-1/3 items-center justify-end gap-5 '>
//           <Searchbar/>
//           <CartIcon/>
//            <Favouritebutton/>
//            <ClerkLoaded>
//             <SignedIn>
//               <UserButton/>
//             </SignedIn>
//           {!user && <SignIn/>}
//            </ClerkLoaded>   
//         </div>
//       </Container>
//     </header>
//   )
// }

// export default Header;
import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import CartIcon from "./CartIcon";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logs } from "lucide-react";
import HeaderMenu from "./HeaderMenu";
import Searchbar from "./Searchbar";
import Favouritebutton from "./Favouritebutton";


const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;
  // if (userId) {
  //   orders = await getMyOrders(userId);
  // }

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <Searchbar />
          <CartIcon />
          <Favouritebutton />

          {user && (
            <Link
              href={"/orders"}
              className="group relative hover:text-shop_light_green hoverEffect"
            >
              <Logs />
              {/* <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {orders?.length ? orders?.length : 0}
              </span> */}
            </Link>
          )}

          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>
            {!user && <SignIn />}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
