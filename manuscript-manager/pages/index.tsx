import { Inter } from "next/font/google";
import AtAGlance from "@/components/stats/atAGlance";
import jan from "@/data/Jan.json";
import feb from "@/data/Feb.json";
import ManuscriptTable from "@/components/table/table";
import CreateManuscript from "@/components/manuscript/createManuscript";
import { getServerSession } from "next-auth";
import { GetServerSideProps } from "next"; // in-built getServerSideProps type
import clientPromise from "../lib/mongodb";
import { ManuscriptType } from "@/types/manuscripts";
import ProfileAvatarDropdown from "@/components/profile/profileIcon";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserType from "@/types/user";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";

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
  user: UserType;
}

export default function Home(props: HomeProps) {
  const {
    todaysManuscripts,
    thisMonthsManuscripts,
    lastMonthsManuscripts,
    user,
  } = props;
  const [manuscriptToUpdate, setManuscriptToUpdate] = useState<
    ManuscriptType | undefined
  >(undefined);
  const [manuscriptsInState, setManuscriptsInState] = useState<
    ManuscriptType[]
  >([...todaysManuscripts]);

  console.log("Client side user is: ", user);

  return (
    <main className={`min-h-screen py-16 px-24 ${inter.className}`}>
      <Grid templateColumns="repeat(10, 1fr)" gap="12">
        <GridItem colSpan={3} id="sidebar">
          <Flex direction="column" gap="12">
            <Heading size="lg">Manuscript Manager</Heading>
            <CreateManuscript
              user={user}
              manuscriptToUpdate={manuscriptToUpdate}
              setManuscriptsInState={setManuscriptsInState}
            />
          </Flex>
        </GridItem>
        <GridItem colSpan={7}>
          <Flex id="maincontent" direction="column" gap="12">
            <div className="self-end">
              <ProfileAvatarDropdown />
            </div>
            <Flex direction="column" gap="12">
              <AtAGlance
                month={monthlySummary(thisMonthsManuscripts)}
                prevMonth={monthlySummary(lastMonthsManuscripts)}
              />
              <ManuscriptTable
                data={manuscriptsInState}
                setManuscriptToUpdate={setManuscriptToUpdate}
                manuscriptsInState={manuscriptsInState}
                setManuscriptsInState={setManuscriptsInState}
                caption="(Today's manuscripts)"
              />
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
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

  // gets userdata from the session and passes a user object to the page. This is basically the same data as the user session, but it has the payrate added.

  const session = await getServerSession(context.req, context.res, authOptions);

  let user = {};

  if (session) {
    // Find the document with the same email
    const email = session?.user?.email;
    const userData = await db.collection("users").findOne({ email });

    //creates and passes user object for email and payrate usage. Probably not the correct way, as this overlaps with getSession, but it works.
    user = {
      name: userData?.name,
      email: userData?.email,
      payRate: userData?.payRate ? userData.payRate : null,
    };
    console.log("user updated: ", user);
  }

  console.log("server-side user is: ", user);

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
      user,
    },
  };
};
