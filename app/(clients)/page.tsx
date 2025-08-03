import React from 'react'
import Container from '@/components/Container'
import Homebanner from '@/components/Homebanner'
import ProductGrid from '@/components/ProductGrid'



const Home = () => {
  return (
    <Container className=' bg-shop-light-pink'>
       <Homebanner/> 
       <div className='py-10'>
       <ProductGrid/>
       </div>
    </Container>
    
  )
}

export default Home
