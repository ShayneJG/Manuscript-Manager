import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getTodaysManuscripts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get today's date for filtering purposes
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0); // sets time to 00:00:00.000 UTC
  try {
    const client = await clientPromise; // clientPromise is a function that gets the instance of the MongoDB database
    const db = client.db("test"); // specifies which collection in the database we are accessing

    // gets manuscripts with a date greater than or equal to today, midnight (UTC)
    const data = await db
      .collection("manuscripts")
      .find({ date: { $gte: today.toISOString() } })
      .sort({ date: -1 })
      .toArray();
    res.json(data);
  } catch (e) {
    console.error(e);
  }
}
