import { type SchemaTypeDefinition } from 'sanity'
import { categoryType } from './categoryType'
import { authorType } from './authorTypes'
import { addressType } from './addressType'
import { blogType } from './blogType'
import { blockContentType } from './blockContentType'
import { brandType } from './brandType'
import { productType } from './productType'
import { blogCategoryType } from './blogCategoryType'
import { orderType } from './orderType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType,  
    authorType ,
    blockContentType,
    productType, 
    orderType, 
    brandType,
    blogType,
    blogCategoryType, 
    addressType],
}
