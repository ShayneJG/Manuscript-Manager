import clientPromise from "@/lib/mongodb";

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

//expects name and email to be parsed through req.body

 export default async function createUser(req: NextApiRequest, res: NextApiResponse) {

    let user = req.body;
    //initialise user to have a default payrate.
    user = {...user, payRate: process.env.PAYRATE_DEFAULT}

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          res.send({ error: 'Session not authenticated' });
        } else {
            const client = await clientPromise; // clientPromise is a function that gets the instance of the MongoDB database
            const db = client.db()

      // create new user based on req.body
      await db.collection('users').insertOne(user);
      console.log("New user created");
      res.send({ message: 'User created successfully',
                 payRate: process.env.PAYRATE_DEFAULT });
        }

        

}catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }}