// API endpoint to DELETE a manuscript from MongoDB

import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function deleteManuscript(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  try {
    const { id } = req.body;
    const client = await clientPromise;
    const query = { manuscriptID: id };

    const response = await client
      .db()
      .collection("manuscripts")
      .deleteOne(query);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An error occurred" });
  }
}
