import { Inter } from "next/font/google";
import AtAGlance from "@/components/stats/atAGlance";

import jan from "@/data/Jan.json";
import feb from "@/data/Feb.json";
import ManuscriptTable from "@/components/table/table";
import { fakeManuscripts } from "@/data/Manuscripts";
import CreateManuscript from "@/components/manuscript/createManuscript";
import { Grid, GridItem } from "@chakra-ui/react";
import ProfileAvatarDropdown from "@/components/profile/profileDropdownIcon";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Grid
      templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
      gridTemplateRows={"50px 1fr 30px"}
      gridTemplateColumns={"1fr"}
    >
      <GridItem area="header">
        <h1>MANUSCRIPT MANAGER</h1>
      </GridItem>
      <GridItem area="nav">
        <ProfileAvatarDropdown />
        <CreateManuscript />
      </GridItem>
      <GridItem area="main">
        <main
          className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
          <ManuscriptTable data={fakeManuscripts} caption="Test Table" />
        </main>
      </GridItem>
      <GridItem area="footer">
        <AtAGlance month={jan} prevMonth={feb} />
      </GridItem>
    </Grid>
  );
}
