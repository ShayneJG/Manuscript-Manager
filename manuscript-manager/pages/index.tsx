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
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserType from "@/types/user";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import currentAndPreviousMonths from "@/utils/database/current-previous";
import Head from "next/head";

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

  // console.log("Client side user is: ", user);

  return (
    <main>
      <Head>
        <title>Manuscript Manager</title>
      </Head>

      <Grid templateColumns="repeat(10, 1fr)" gap="12">
        <GridItem colSpan={3} id="sidebar">
          <Flex direction="column" gap="12">
            <CreateManuscript
              user={user}
              setManuscriptToUpdate={setManuscriptToUpdate}
              manuscriptToUpdate={manuscriptToUpdate}
              setManuscriptsInState={setManuscriptsInState}
            />
          </Flex>
        </GridItem>
        <GridItem colSpan={7}>
          <Flex id="maincontent" direction="column" gap="12">
            <Flex direction="column" gap="12">
              <AtAGlance
                thisMonthsManuscripts={thisMonthsManuscripts}
                lastMonthsManuscripts={lastMonthsManuscripts}
                manuscriptsInState={manuscriptsInState}
              />
              <ManuscriptTable
                data={manuscriptsInState}
                setManuscriptToUpdate={setManuscriptToUpdate}
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
  const db = client.db();

  // gets userdata from the session and passes a user object to the page. This is basically the same data as the user session, but it has the payrate added.

  const session = await getServerSession(context.req, context.res, authOptions);

  let user: UserType = {
    name: "guest",
    email: "guest@email.com",
    payRate: Number(process.env.PAYRATE_DEFAULT),
  };

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
    // console.log("user updated: ", user);
  }

  // console.log("server-side user is: ", user);

  const [todaysManuscripts, thisMonthsManuscripts, lastMonthsManuscripts] =
    await currentAndPreviousMonths(user.name);

  return {
    props: {
      todaysManuscripts,
      thisMonthsManuscripts,
      lastMonthsManuscripts,
      user,
    },
  };
};
