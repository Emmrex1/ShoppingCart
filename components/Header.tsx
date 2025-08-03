import React from 'react'
import Container from './Container';
import Logo from './Logo';
import HeaderMenu from './HeaderMenu';
import Searchbar from './Searchbar';
import CartIcon from './CartIcon';
import Favouritebutton from './Favouritebutton';
import SignIn from './SignIn';
import MobileMenu from './MobileMenu';
import { currentUser } from '@clerk/nextjs/server';
import { ClerkLoaded, SignedIn, UserButton } from '@clerk/nextjs';

const Header = async () => {
  const user = await currentUser()
  return (
    <header className='bg-white/70 py-5 sticky top-0 z-50 backdrop-blur-md'> 
      <Container className='flex justify-between items-center text-lightColor'>
       <div className='flex w-auto md:w-1/3 items-center justify-start gap-2.5 md:gap-0 '>
         <MobileMenu/>
        <Logo/>
        </div>
        <HeaderMenu/>
        <div className='flex w-auto md:w-1/3 items-center justify-end gap-5 '>
          <Searchbar/>
          <CartIcon/>
           <Favouritebutton/>
           <ClerkLoaded>
            <SignedIn>
              <UserButton/>
            </SignedIn>
          {!user && <SignIn/>}
           </ClerkLoaded>   
        </div>
      </Container>
    </header>
  )
}

export default Header;
