import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserType from "@/types/user";
import { IncomingMessage, OutgoingMessage } from "http";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

interface getUserProps {
  req: IncomingMessage;
  res: OutgoingMessage;
}

export default async function getUser(context: GetServerSidePropsContext) {
  const client = await clientPromise;
  const db = client.db();

  // gets userdata from the session and passes a user object to the page. This is basically the same data as the user session, but it has the payrate added.

  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    // Find the document with the same email
    const email = session?.user?.email;
    const userData = await db.collection("users").findOne({ email });

    //creates and passes user object for email and payrate usage. Probably not the correct way, as this overlaps with getSession, but it works.
    let user: UserType = {
      name: userData?.name,
      email: userData?.email,
      payRate: userData?.payRate ? userData.payRate : null,
    };
    return user;
  }
  return null;
}
