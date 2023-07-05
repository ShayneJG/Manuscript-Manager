import clientPromise from "@/lib/mongodb";

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

//expects email and payRate to be parsed through req.body

 export default async function updateUser(req: NextApiRequest, res: NextApiResponse) {

    let user = req.body;
    console.log(user)
    

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          res.send({ error: 'Session not authenticated' });
        } else {
            const client = await clientPromise; // clientPromise is a function that gets the instance of the MongoDB database
            const db = client.db("test")

      // find user based on email
      const response = await db.collection('users').findOneAndUpdate(
        { email: user.email }, // Filter for finding the document
        { $set: { payRate: user.payRate, earnings: user.earnings } }, // Update operation using the $set operator

      );
      
      if (response.value) {
        // Document was found and updated successfully
        console.log('Document updated:', response.value);
        res.status(200).send({message: "document update success"})
      } else {
        // Document with the specified email was not found
        console.log('Document not found');
        } }
        

        

}catch (error) {
    res.status(500).send({ error: 'Internal server error' });
    console.error(error)
  }}