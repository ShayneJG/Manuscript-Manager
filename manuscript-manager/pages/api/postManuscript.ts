// API endpoint to POST a manuscript to MongoDB

import clientPromise from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function postManuscript(req: NextApiRequest, res: NextApiResponse) {
  // Checks the request is POST    
  if (req.method !== 'POST') {
            res.status(405).send({ message: 'Only POST requests allowed' })
            return
          } // This is not necessary but is good practice.
      
          console.log(req.body);
          const newManuscript = req?.body;
          
          try {
            const client = await clientPromise;
            const response = await client.db().collection("manuscripts").insertOne(newManuscript);
            return res.status(200).json(response);
        } catch (e) {
            console.error(e);
        }

      
}