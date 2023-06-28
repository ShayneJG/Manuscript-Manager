import { StatGroup } from "@chakra-ui/react";
import { jsx } from "@emotion/react";
import Summary from "./summary";
import { ManuscriptType } from "@/types/manuscripts";
import { useEffect, useState } from "react";
import { monthlySummary } from "@/utils/monthlyTotals";

export interface Earnings {
  totalWordCount: number;
  totalLatexBonus: number;
  totalOtherBonuses: number;
  totalEarnings: number;
  totalMinusBonuses: number;
}
interface AtAGlanceProps {
  thisMonthsManuscripts: ManuscriptType[];
  lastMonthsManuscripts: ManuscriptType[];
  manuscriptsInState: ManuscriptType[];
}

function AtAGlance({
  thisMonthsManuscripts,
  lastMonthsManuscripts,
  manuscriptsInState,
}: AtAGlanceProps) {
  // Calculate stats for each month's mansuscripts
  const [month, setMonth] = useState<Earnings>(
    monthlySummary(thisMonthsManuscripts)
  );
  const prevMonth = monthlySummary(lastMonthsManuscripts);

  // useEffect updates monthlyManuscripts if manuscriptsInState updates
  useEffect(() => {
    const monthlyManuscripts = [
      ...thisMonthsManuscripts,
      ...manuscriptsInState,
    ];
    setMonth(monthlySummary(monthlyManuscripts));
  }, [manuscriptsInState]);

  // generates the summaries for each property of earnings
  const summaries: JSX.Element[] = Object.keys(month).map((key) => (
    <Summary
      key={key}
      label={key}
      statistic={month[key as keyof Earnings]}
      lastStatistic={prevMonth[key as keyof Earnings]}
    />
  ));

  return <StatGroup>{summaries}</StatGroup>;
}

export default AtAGlance;
