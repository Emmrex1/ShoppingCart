import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, 
})
// import { createClient } from "next-sanity";

// export const client = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
//   apiVersion: "2023-08-01",
//   useCdn: process.env.NODE_ENV === "production",
// });