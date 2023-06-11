import clientPromise from "@/lib/mongodb";

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

//expects name and email to be parsed through req.body

 export default async function createUser(req: NextApiRequest, res: NextApiResponse) {

    let user = req.body;
    user = {...user, payRate: process.env.PAYRATE_DEFAULT}

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          res.send({ error: 'Session not authenticated' });
        } else {
            const client = await clientPromise; // clientPromise is a function that gets the instance of the MongoDB database
            const db = client.db("test")

      // create new user based on req.body
      await db.collection('users').insertOne(user);
      console.log("New user created");
      res.send({ message: 'User created successfully' });
        }

        

}catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }}