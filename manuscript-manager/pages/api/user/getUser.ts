import clientPromise from "@/lib/mongodb";

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';



export default  async function getUser(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query; 
     
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.send({ error: 'Session not authenticated' });
    } else {
        const client = await clientPromise; // clientPromise is a function that gets the instance of the MongoDB database
        const db = client.db("test")

      // Find the document with the same email
      const user = await db.collection('users').findOne({ email });
      
      if (user) {
        res.send({ user });
      } else {
        res.send({ error: 'User not found' });
      } 
    }
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
}

