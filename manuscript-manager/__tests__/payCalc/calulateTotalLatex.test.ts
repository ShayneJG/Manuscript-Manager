import { calculateTotalLatex } from "@/utils/monthlyTotals";
import Manuscript from "@/data/testManuscripts/testManuscripts";
import { ManuscriptType } from "@/types/manuscripts";

const test: ManuscriptType[] = [
  new Manuscript("test-1", 6000, 0, undefined, true),
  new Manuscript("test-2", 6000, 0, undefined, false),
  new Manuscript("test-3", 6000, 0, undefined, false),
  new Manuscript("test-4", 6000, 0, undefined, true),
];

it("should return the extra wordcount to be added for latex bonus", () => {
    expect(calculateTotalLatex(test)).toBe(2400);
});
