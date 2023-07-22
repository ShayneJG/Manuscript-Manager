import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserType from "@/types/user";

export default async function getTodaysManuscripts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get today's date for filtering purposes
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0); // sets time to 00:00:00.000 UTC

  try {
    const client = await clientPromise;
    const db = client.db();

    // get user data
    const session = await getServerSession(req, res, authOptions);

    let user: UserType = {
      name: "guest",
      email: "guest@email.com",
      payRate: Number(process.env.PAYRATE_DEFAULT),
    };

    if (session) {
      // Find the document with the same email
      const email = session?.user?.email;
      const userData = await db.collection("users").findOne({ email });

      user = {
        name: userData?.name,
        email: userData?.email,
        payRate: userData?.payRate ? userData.payRate : null,
      };
    }

    // gets manuscripts with a date greater than or equal to today, midnight (UTC), for the current user
    const data = await db
      .collection("manuscripts")
      .find({ date: { $gte: today.toISOString() }, user: user.name })
      .sort({ date: -1 })
      .toArray();
    res.json(data);
  } catch (e) {
    console.error(e);
  }
}
