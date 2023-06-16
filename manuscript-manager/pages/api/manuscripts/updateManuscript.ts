// API endpoint to PATCH a manuscript to MongoDB

import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export default async function updateManuscript(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Checks the request is POST
  if (req.method !== "PATCH") {
    res.status(405).send({ message: "Only PATCH requests allowed" });
    return;
  }

  try {
    const { id } = req.query as { id: string };
    // convert string id to ObjectId id to match db type
    const objectId = new ObjectId(id);
    const client = await clientPromise;
    const response = await client
      .db()
      .collection("manuscripts")
      .findOneAndUpdate(
        { _id: objectId },
        { $set: { ...req.body } },
        { returnDocument: "after" }
      );
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
  }
}
