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
import ProfileAvatarDropdown from "@/components/profile/profileIcon";
import { determinePrevMonthStartDate, determineStartDate } from "@/utils/dates";
import { currentDates } from "@/utils/dates";

const inter = Inter({ subsets: ["latin"] });

export default function Home({
  manuscripts,
}: {
  manuscripts: ManuscriptType[];
}) {
  console.log(manuscripts);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>TEST PAGE</h1>
      <ProfileAvatarDropdown />
      <div id="stat-test">
        <CreateManuscript />
        <ManuscriptTable data={manuscripts} caption="Test data from MongoDB" />
        <AtAGlance month={jan} prevMonth={feb} />
      </div>
    </main>
  );
}

// getServerSideProps will find manuscripts from the DB before sending data to end-user
export const getServerSideProps: GetServerSideProps = async (context) => {
  // we need today's manuscripts, this month's manuscripts, and last month's manuscripts
  const client = await clientPromise;
  const db = client.db("test");
  const currentDate = new Date();
  const lastMonthStartDate = determinePrevMonthStartDate(currentDate);

  // gets all manuscripts after (and including) the first day of the previous pay period (21st)
  const data = await db
    .collection("manuscripts")
    .find({ date: { $gte: lastMonthStartDate.toISOString() } })
    .sort({ date: 1 })
    .toArray();

  // filter data for today's manuscripts, this month's manuscripts, and last month's
  // today

  // this month

  // last month

  // getServerSideProps can only be passed a plain JS object
  // When we get data from MongoDB, it contains complex data types - Object ids, doubles, floats, etc.
  // getServerSideProps can only deal with strings, numbers, arrays, objects, etc.
  // So we have to add this workaround of stringifying the data we get back, and then reparsing it:
  const manuscripts = JSON.parse(JSON.stringify(data));

  return {
    props: { manuscripts: manuscripts },
  };
};
