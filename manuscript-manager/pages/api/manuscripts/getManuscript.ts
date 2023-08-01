// This is an API endpoint for accessing the manuscripts from the database

// The lib/mongodb file contains instructions on how to connect to MongoDB Atlas cluster
// Within that file the instance of our connection is cached, so subsequent requests do not have to reconnect
import { getServerSession } from "next-auth";
import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";

// API route handler that gets executed when the .../api/manuscript route is called
export default async function getManuscript(req: NextApiRequest, res: NextApiResponse) {
  try {

    //check that a user is logged in.
    const session = await getServerSession(req, res, authOptions);

    if(!session) {
      res.status(406).send("User not found")
    }



    if (req.method === "GET") {
      const  identification  = req.query.identification;
      const client = await clientPromise; // clientPromise is a function that gets the instance of the MongoDB database
      const db = client.db(); // specifies which collection in the database we are accessing

      const manuscript = await db // uses MongoDB MQL queries to access info from the database
        .collection("manuscripts") // specifies the subsection/subcollection
        .findOne({ manuscriptID: identification,
        user: session?.user?.name});
      if (manuscript) {

        res.status(200).json(JSON.parse(JSON.stringify(manuscript)));
        
      } else {
        res.status(404).send("No manuscript found");
      }
    } // serves the response in JSON format to the browser - this will be displayed when visiting the /api/manuscripts path in browser
    else {
      res.status(405).send("Method not allowed");
    }
  } catch (e: any) {

    console.log(e)
    res.status(500).send(e.message);
  }
}
