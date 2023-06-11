import clientPromise from "@/lib/mongodb";

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

//expects email and payRate to be parsed through req.body

 export default async function updateUser(req: NextApiRequest, res: NextApiResponse) {

    let user = req.body;
    

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          res.send({ error: 'Session not authenticated' });
        } else {
            const client = await clientPromise; // clientPromise is a function that gets the instance of the MongoDB database
            const db = client.db("test")

      // find user based on email
      const response = await db.collection('users').findOne(user.email);

        if(response) {
            await db.collection('users').updateOne(response, {payRate: user.payRate})
        }
      
        }

        

}catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }}