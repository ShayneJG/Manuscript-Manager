//TODO: Create function that takes monthly manuscripts and returns the following info for the month:
// {
//       "wordcount": 1100,
//       "latex bonus": 60,
//       "additional bonuses": 12,
//       "earnings": 100,
//       "total minus bonuses": 12
//     }

import { ManuscriptType } from "@/types/manuscripts";
import { defaultPayRate, defaultLatexBonus } from "./constants";
import { Earnings } from "@/components/stats/atAGlance";

// calculates total wordcount for a given array of manuscripts
function calculateTotalWordCount(manuscripts: ManuscriptType[]): number {
  const totalWordCount = manuscripts.reduce((total, manuscript) => {
    return total + manuscript.wordCount + manuscript.authorBio;
  }, 0);
  return totalWordCount;
}

// calculates total latex bonus for a given array of manuscripts
function calculateTotalLatex(manuscripts: ManuscriptType[]): number {
  // for each manuscript, check if latex is true
  // if it is, multiply manuscript.wordCount by defaultLatexBonus, add the results together
  const totalLatexBonus = manuscripts
    .filter((manuscript) => manuscript.latex)
    .reduce((total, latexManuscript) => {
      return (
        total +
        (latexManuscript.wordCount + latexManuscript.authorBio) *
          defaultLatexBonus
      );
    }, 0);

  return totalLatexBonus;
}

// alternative function to check if manuscript is under 4 hours (currently doesn't work properly)
// function isUnderFourHours(turnAround: string): boolean {
//   const [hours, minutes, seconds] = turnAround.trim().split(":").map(Number);
//   const totalHours = hours + minutes / 60 + seconds / 3600;
//   return totalHours < 4;
// }

// calculates total other bonuses (speed, double, triple, extra)
function calculateTotalBonus(manuscripts: ManuscriptType[]): number {
  // check if speed bonus applies
  // for each manuscript, check if speed is true
  // if it is, multiply manuscript.wordCount by 0.1, add the results together
  const totalSpeedBonus = manuscripts
    .filter((manuscript) => parseInt(manuscript.turnAround, 10) < 4)
    .reduce((total, speedyManuscript) => {
      return total + speedyManuscript.wordCount * 0.1;
    }, 0);

  // check if double applies
  const totalDoubleBonus = manuscripts
    .filter((manuscript) => manuscript.double)
    .reduce((total, doubleManuscript) => {
      return total + doubleManuscript.wordCount * 2;
    }, 0);

  // check if triple applies
  const totalTripleBonus = manuscripts
    .filter((manuscript) => manuscript.triple)
    .reduce((total, tripleManuscript) => {
      return total + tripleManuscript.wordCount * 3;
    }, 0);

  // check if other bonus applies
  const totalOtherBonus = manuscripts
    .filter((manuscript) => manuscript.bonus)
    .reduce((total, bonusManuscript) => {
      const bonus = bonusManuscript.bonus / 100;
      return total + bonusManuscript.wordCount * bonus;
    }, 0);

  const totalBonus =
    totalSpeedBonus + totalDoubleBonus + totalTripleBonus + totalOtherBonus;
  return totalBonus;
}

// calculates total pay for a given array of manuscripts
export function calculateTotalEarnings(manuscripts: ManuscriptType[]): number {
  const totalWordCount = calculateTotalWordCount(manuscripts);
  const totalLatexBonus = calculateTotalLatex(manuscripts);
  const totalOtherBonuses = calculateTotalBonus(manuscripts);

  const earnings =
    (totalWordCount + totalLatexBonus + totalOtherBonuses) * defaultPayRate;

  return earnings;
}

export function monthlySummary(manuscripts: ManuscriptType[]): Earnings {
  let totalWordCount = 0;
  let totalLatexBonus = 0;
  let totalOtherBonuses = 0;
  let totalEarnings = 0;
  let totalMinusBonuses = 0;

  if (manuscripts) {
    totalWordCount = Number(calculateTotalWordCount(manuscripts).toFixed(2));
    totalLatexBonus = Number(calculateTotalLatex(manuscripts).toFixed(2));
    totalOtherBonuses = Number(calculateTotalBonus(manuscripts).toFixed(2));
    totalEarnings = Number(calculateTotalEarnings(manuscripts).toFixed(2));
    totalMinusBonuses = Number((totalWordCount * defaultPayRate).toFixed(2));
  }

  return {
    totalEarnings,
    totalMinusBonuses,
    totalWordCount,
    totalLatexBonus,
    totalOtherBonuses,
  };
}
