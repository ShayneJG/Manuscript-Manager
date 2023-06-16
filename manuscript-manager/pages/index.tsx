import { Inter } from "next/font/google";
import AtAGlance from "@/components/stats/atAGlance";
import jan from "@/data/Jan.json";
import feb from "@/data/Feb.json";
import ManuscriptTable from "@/components/table/table";
import { fakeManuscripts } from "@/data/Manuscripts";
import CreateManuscript from "@/components/manuscript/createManuscript";
import { getServerSession } from "next-auth";

import { GetServerSideProps } from "next"; // in-built getServerSideProps type
import clientPromise from "../lib/mongodb";
import { ManuscriptType } from "@/types/manuscripts";
import ProfileAvatarDropdown from "@/components/profile/profileIcon";
import {authOptions} from "@/pages/api/auth/[...nextauth]"; 
import UserType from "@/types/user";
const inter = Inter({ subsets: ["latin"] });


export default function Home({ manuscripts, user}: { manuscripts: ManuscriptType[], user: UserType}) {
  
  // console.log(manuscripts);
  console.log("Client side user is: ", user)
  
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>TEST PAGE</h1>
      <ProfileAvatarDropdown />
      <div id="stat-test">
        <CreateManuscript user={user} />
        <ManuscriptTable data={manuscripts} caption="Test data from MongoDB" />
        <AtAGlance month={jan} prevMonth={feb} />
      </div>
    </main>
  );
}

// getServerSideProps will find manuscripts from the DB before sending data to end-user
export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = await clientPromise; 
  const db = client.db("test"); 
  
  const data = await db
           .collection("manuscripts") 
           .find({})
           .sort({date: 1})
           .toArray();
           
  
  // getServerSideProps can only be passed a plain JS object
  // When we get data from MongoDB, it contains complex data types - Object ids, doubles, floats, etc. 
  // getServerSideProps can only deal with strings, numbers, arrays, objects, etc.
  // So we have to add this workaround of stringifying the data we get back, and then reparsing it:
  const manuscripts = JSON.parse(JSON.stringify(data));
  

  // gets userdata from the session and passes a user object to the page. This is basically the same data as the user session, but it has the payrate added. 

  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  )

  let user = {}

    if(session) {
      // Find the document with the same email
      const email = session?.user?.email
      const userData = await db.collection('users').findOne({email})
      
      //creates and passes user object for email and payrate usage. Probably not the correct way, as this overlaps with getSession, but it works. 
        user = {name: userData?.name, email: userData?.email, payRate: userData?.payRate ? userData.payRate : null}
        console.log("user updated: ", user)
      }


      
  
  console.log("server-side user is: ", user)

  return {
    props: { manuscripts: manuscripts,
            user: user },
  }
}
