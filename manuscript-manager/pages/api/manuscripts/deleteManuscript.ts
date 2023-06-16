// API endpoint to DELETE a manuscript from MongoDB

import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export default async function deleteManuscript(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "DELETE") {
    try {
      const { id } = req.query as { id: string };

      // convert string id to ObjectId id to match db type
      const objectId = new ObjectId(id);

      if (!id) {
        res.status(400).json({ error: "Missing ID" });
        return;
      }

      const client = await clientPromise;

      const response = await client
        .db()
        .collection("manuscripts")
        .deleteOne({ _id: objectId });

      return res.status(200).json(response);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "An error occurred" });
    }
  }
}
