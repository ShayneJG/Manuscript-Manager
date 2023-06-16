import { Inter } from "next/font/google";
import AtAGlance from "@/components/stats/atAGlance";
import jan from "@/data/Jan.json";
import feb from "@/data/Feb.json";
import ManuscriptTable from "@/components/table/table";
import CreateManuscript from "@/components/manuscript/createManuscript";
import { GetServerSideProps } from "next";
import clientPromise from "../lib/mongodb";
import { ManuscriptType } from "@/types/manuscripts";
import ProfileAvatarDropdown from "@/components/profile/profileIcon";
import {
  currentDate,
  thisMonthStartDate,
  lastMonthStartDate,
} from "@/utils/dates";
import { monthlySummary } from "@/utils/monthlyTotals";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  todaysManuscripts: ManuscriptType[];
  thisMonthsManuscripts: ManuscriptType[];
  lastMonthsManuscripts: ManuscriptType[];
}

export default function Home(props: HomeProps) {
  const { todaysManuscripts, thisMonthsManuscripts, lastMonthsManuscripts } =
    props;
  const [manuscriptToUpdate, setManuscriptToUpdate] = useState<
    ManuscriptType | undefined
  >(undefined);
  const [manuscriptsInState, setManuscriptsInState] = useState<
    ManuscriptType[]
  >([...todaysManuscripts]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>MANUSCRIPT MANAGER</h1>
      <ProfileAvatarDropdown />
      <div id="stat-test">
        <CreateManuscript
          manuscriptToUpdate={manuscriptToUpdate}
          setManuscriptsInState={setManuscriptsInState}
        />
        <ManuscriptTable
          data={manuscriptsInState}
          caption="(Today's manuscripts)"
          setManuscriptToUpdate={setManuscriptToUpdate}
          manuscriptsInState={manuscriptsInState}
          setManuscriptsInState={setManuscriptsInState}
        />
        <AtAGlance
          month={monthlySummary(thisMonthsManuscripts)}
          prevMonth={monthlySummary(lastMonthsManuscripts)}
        />
      </div>
    </main>
  );
}

// getServerSideProps will find manuscripts from the DB before sending data to end-user
export const getServerSideProps: GetServerSideProps = async (context) => {
  // we need today's manuscripts, this month's manuscripts, and last month's manuscripts
  const client = await clientPromise;
  const db = client.db("test");

  // gets all manuscripts after (and including) the first day of the previous pay period (21st)
  const data = await db
    .collection("manuscripts")
    .find({ date: { $gte: lastMonthStartDate.toISOString() } })
    .sort({ date: -1 })
    .toArray();

  // getServerSideProps can only be passed a plain JS object
  // When we get data from MongoDB, it contains complex data types - Object ids, doubles, floats, etc.
  // getServerSideProps can only deal with strings, numbers, arrays, objects, etc.
  // So we have to add this workaround of stringifying the data we get back, and then reparsing it:
  const manuscripts = JSON.parse(JSON.stringify(data));

  // filter data for today's manuscripts, this month's manuscripts, and last month's
  // today: db dates stored as follows: "2023-04-25T08:10:13.000Z", currentDate as follows: Mon Jun 12 2023 16:32:37 GMT+0800 (Australian Western Standard Time)
  const todaysManuscripts = manuscripts.filter((manuscript: ManuscriptType) => {
    const manuscriptDate = new Date(manuscript.date);
    return manuscriptDate.toDateString() == currentDate.toDateString();
  });

  // this month: manuscripts with dates >= this month start date
  const thisMonthsManuscripts = manuscripts.filter(
    (manuscript: ManuscriptType) => {
      const manuscriptDate = new Date(manuscript.date);
      return manuscriptDate >= thisMonthStartDate;
    }
  );

  // last month: manuscripts with dates < this month start date and >= last month start date
  const lastMonthsManuscripts = manuscripts.filter(
    (manuscript: ManuscriptType) => {
      const manuscriptDate = new Date(manuscript.date);
      return (
        manuscriptDate >= lastMonthStartDate &&
        manuscriptDate < thisMonthStartDate
      );
    }
  );

  return {
    props: {
      todaysManuscripts,
      thisMonthsManuscripts,
      lastMonthsManuscripts,
    },
  };
};
