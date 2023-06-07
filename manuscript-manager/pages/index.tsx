import { Inter } from "next/font/google";
import AtAGlance from "@/components/stats/atAGlance";
import jan from "@/data/Jan.json";
import feb from "@/data/Feb.json";
import ManuscriptTable from "@/components/table/table";
import { fakeManuscripts } from "@/data/Manuscripts";
import CreateManuscript from "@/components/manuscript/createManuscript";
import { GetServerSideProps } from "next"; // in-built getServerSideProps type
import clientPromise from "../lib/mongodb";
import { ManuscriptType } from "@/types/manuscripts";

const inter = Inter({ subsets: ["latin"] });


export default function Home({ manuscripts }: { manuscripts: ManuscriptType[] }) {
  
  console.log(manuscripts);
  
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>MANUSCRIPT MANAGER</h1>
      <div id="stat-test">
        <a href="/api/auth/login">Login</a>
        <a href="/api/auth/logout">Logout</a>
        <CreateManuscript />
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
  
  return {
    props: { manuscripts: manuscripts },
  }
}
