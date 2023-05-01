//this function acts as a wrapper for the stats components from Chakra. This basically makes the stats component reusable.

import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";

interface SummaryProps {
  statistic: number;
  label: string;

  lastStatistic?: number;
}

function Summary({ statistic, label, lastStatistic }: SummaryProps) {
  return (
    <Stat>
      <StatLabel>{label}</StatLabel>
      <StatNumber>{statistic}</StatNumber>
      {statistic && lastStatistic ? (
        <StatHelpText>
          Last {label}: {lastStatistic}
          <StatArrow
            type={statistic > lastStatistic ? "increase" : "decrease"}
          ></StatArrow>
        </StatHelpText>
      ) : undefined}
    </Stat>
  );
}

export default Summary;
/*

DETAILS

<Stat> is the wrapper of the chakra stat component. 

<StatLabel> is the label of the stat. Works pretty much identical to HTML <label> and is setup already to have HTMLfor -> <Statnumber>

<StatNumber> is the stat itself, i.e., whatever it is that the stat is made to display. 

<StatHelpText> is subtext for the component, so non-label related text associated with the stat. 

<StatArrow> is a component that takes prop type of 'increase' or 'decrease' to show up or down arrow, respectively. 

<StatGroup> is the wrapper for a set of Stat components, if we wanted stats to be grouped together. 


*/
