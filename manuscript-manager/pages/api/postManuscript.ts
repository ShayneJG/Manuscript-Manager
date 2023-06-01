// API endpoint to POST manuscript to MongoDB


import clientPromise from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';



export default async (req: NextApiRequest, res: NextApiResponse) => {
 
      if (req.method !== 'POST') {
            res.status(405).send({ message: 'Only POST requests allowed' })
            return
          }
      
}