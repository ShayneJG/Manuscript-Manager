import { Inter } from "next/font/google";
import AtAGlance from "@/components/stats/atAGlance";

import jan from "@/data/Jan.json";
import feb from "@/data/Feb.json";
import ManuscriptTable from "@/components/table/table";
import { fakeManuscripts } from "@/data/Manuscripts";
import CreateManuscript from "@/components/manuscript/createManuscript";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>MANUSCRIPT MANAGER</h1>
      <div id="stat-test">
        <a href="/api/auth/login">Login</a>
        <a href="/api/auth/logout">Logout</a>
        <CreateManuscript />
        <ManuscriptTable data={fakeManuscripts} caption="Test Table" />
        <AtAGlance month={jan} prevMonth={feb} />
      </div>
    </main>
  );
}
