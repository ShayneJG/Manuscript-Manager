import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getTodaysManuscripts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get yesterday's date for filtering purposes
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  try {
    const client = await clientPromise; // clientPromise is a function that gets the instance of the MongoDB database
    const db = client.db("test"); // specifies which collection in the database we are accessing

    const data = await db
      .collection("manuscripts")
      .find({ date: { $gt: yesterday.toISOString() } })
      .sort({ date: -1 })
      .toArray();
    res.json(data);
  } catch (e) {
    console.error(e);
  }
}
