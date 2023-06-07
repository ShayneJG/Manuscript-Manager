import { StatGroup } from "@chakra-ui/react";
import { jsx } from "@emotion/react";
import Summary from "./summary";

interface Earnings {
  wordcount: number;
  bonus: number;
  "latex bonus": number;
  base: number;
}

interface AtAGlanceProps {
  month: Earnings;
  prevMonth: Earnings;
}

function AtAGlance({ month, prevMonth }: AtAGlanceProps) {
  //generates the summaries for each property of earnings
  const summaries: JSX.Element[] = Object.keys(month).map((key) => (
    <Summary
      label={key}
      statistic={month[key as keyof Earnings]}
      lastStatistic={prevMonth[key as keyof Earnings]}
    />
  ));

  return <StatGroup>{summaries}</StatGroup>;
}

export default AtAGlance;
