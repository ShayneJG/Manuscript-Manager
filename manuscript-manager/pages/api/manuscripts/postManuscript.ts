// API endpoint to POST a manuscript to MongoDB

import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function postManuscript(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Checks the request is POST
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  } // This is not necessary but is good practice.

  const newManuscript = req?.body;

  try {
    const client = await clientPromise;
    const collection = client.db().collection("manuscripts");
  
    const existingManuscript = await collection.findOne({
      manuscriptID: newManuscript.manuscriptID,
    });
  
    if (existingManuscript) {
      return res.status(409).json({ message: "Manuscript already exists" });
    } else {
      const response = await collection.insertOne(newManuscript);
  
      // Fetch the newly inserted manuscript separately using its unique identifier
      const insertedManuscript = await collection.findOne({
        _id: response.insertedId,
      });
  
      return res.status(200).json(insertedManuscript);
    }
  } catch (error) {
    return res.status(500).json(error);
  }}
