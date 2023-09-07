import AtAGlance from "@/components/stats/atAGlance";
import ManuscriptTable from "@/components/table/table";
import CreateManuscript from "@/components/manuscript/createManuscript";
import { GetServerSideProps } from "next"; // in-built getServerSideProps type
import { ManuscriptType } from "@/types/manuscripts";
import UserType from "@/types/user";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import currentAndPreviousMonths from "@/utils/database/current-previous";
import Head from "next/head";
import getUser from "@/utils/getUser";

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
  //holds the manuscript that is being updated, if one is being updated. If one is not being updated, it is undefined.
  const [manuscriptToUpdate, setManuscriptToUpdate] = useState<
    ManuscriptType | undefined
  >(undefined);
  //holds manuscripts to be displayed in the table. Retrieved via getServerSideProps, initialised as todays manuscripts.
  const [manuscriptsInState, setManuscriptsInState] = useState<
    ManuscriptType[]
  >([...todaysManuscripts]);

  // console.log("Client side user is: ", user);

  return (
    <main>
      {/* this head component injects the title into the DOM */}
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

  //TODO: FIX user typing. Strong typing conflicts with our front end authentication.
  //TODO: refactored user data fetching. DO NOT DEPLOY to production until tested properly.
  const session = await getUser(context);
  let user: any = {};
  if (session) {
    user = session;
  }
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
