// The lib/mongodb file contains instructions on how to connect to MongoDB Atlas cluster
// Within that file the instance of our connection is cached, so subsequent requests do not have to reconnect
import clientPromise from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';

// API route handler that gets executed when the .../api/properties route is called
export default async (req: NextApiRequest, res: NextApiResponse) => {
   try {
       const client = await clientPromise; // clientPromise is a function that gets the instance of the MongoDB database
       const db = client.db("test"); // specifies which collection in the database we are accessing

       const manuscripts = await db // uses MongoDB MQL queries to access info from the database
           .collection("manuscripts")
           .find({})
           .limit(5)
           .toArray();

       res.json(manuscripts); // serves the response in JSON format to the browser - this will be displayed when visiting the /api/manuscripts path in browser
   } catch (e) {
       console.error(e);
   }
};