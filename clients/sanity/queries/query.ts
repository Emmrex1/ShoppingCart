import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) `);

const LATEST_BLOG_QUERY = defineQuery(
  ` *[_type == 'blog' && isLatest == true]|order(name asc){
      ...,
      blogcategories[]->{
      title
    }
    }`
);

const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,"categories": categories[]->title
  }`
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0]`
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug]{
  "brandName": brand->title
  }`);

const MY_ORDERS_QUERY =
  defineQuery(`*[_type == 'order' && customerId == $userId] | order(orderData desc){
...,products[]{
  ...,product->
}
}`);
const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
  ...,  
     blogcategories[]->{
    title
}
    }
  `
);

const SINGLE_BLOG_QUERY =
  defineQuery(`*[_type == "blog" && slug.current == $slug][0]{
  ..., 
    author->{
    name,
    image,
  },
  blogcategories[]->{
    title,
    "slug": slug.current,
  },
}`);

const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blog"]{
     blogcategories[]->{
    ...
    }
  }`
);

const OTHERS_BLOG_QUERY = defineQuery(`*[
  _type == "blog"
  && defined(slug.current)
  && slug.current != $slug
]|order(publishedAt desc)[0...$quantity]{
...
  publishedAt,
  title,
  mainImage,
  slug,
  author->{
    name,
    image,
  },
  categories[]->{
    title,
    "slug": slug.current,
  }
}`);

import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

// Add this query to fetch orders for a specific user
export const getMyOrders = async (userId: string) => {
  try {
    const query = groq`*[_type == "order" && userId == $userId] | order(orderDate desc) {
      _id,
      orderNumber,
      orderDate,
      customerName,
      email,
      totalPrice,
      currency,
      status,
      invoice,
      "id": _id
    }`;
    
    return await client.fetch(query, { userId });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// You might also want to add this query to get a single order by ID
export const getOrderById = async (orderId: string) => {
  try {
    const query = groq`*[_type == "order" && _id == $orderId][0] {
      _id,
      orderNumber,
      orderDate,
      customerName,
      email,
      totalPrice,
      currency,
      status,
      address,
      products[] {
        _key,
        quantity,
        product-> {
          _id,
          name,
          price,
          images
        }
      },
      invoice,
      stripeCheckoutSessionId,
      stripePaymentIntentId
    }`;
    
    return await client.fetch(query, { orderId });
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};


export {
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
  GET_ALL_BLOG,
  SINGLE_BLOG_QUERY,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
};
