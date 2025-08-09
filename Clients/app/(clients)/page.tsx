import React from 'react'
import Container from '@/components/Container'
import Homebanner from '@/components/Homebanner'
import ProductGrid from '@/components/ProductGrid'
import HomeCategories from '@/components/HomeCategories'
import { getCategories } from '@/sanity/queries'
import ShopByBrands from '@/components/ShopBrands'
import LatestBlog from '@/components/LatestBlog'



const Home = async () => {
  const categories = await getCategories(6)
  return (
    <Container className=' bg-shop-light-pink'>
      
       <Homebanner/> 
       <ProductGrid/>
      <HomeCategories categories={categories}/>
       <ShopByBrands/>
       <LatestBlog/>
    </Container>
    
  )
}

export default Home
