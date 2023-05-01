import { Inter } from "next/font/google";
import Summary from "../components/stats/summary";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>TEST PAGE</h1>
      <div id="stat-test"></div>
      <Summary label="month" statistic={1200} lastStatistic={1000} />
    </main>
  );
}
