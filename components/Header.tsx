import React from 'react'
import Container from './Container';
import Logo from './Logo';
import HeaderMenu from './HeaderMenu';
import Searchbar from './Searchbar';
import CartIcon from './CartIcon';
import Favouritebutton from './Favouritebutton';
import SignIn from './SignIn';
import MobileMenu from './MobileMenu';

const Header = () => {
  return (
    <header className='bg-white py-5 border-b border-b-black/20'> 
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
           <SignIn/>
        </div>
      </Container>
    </header>
  )
}

export default Header;
