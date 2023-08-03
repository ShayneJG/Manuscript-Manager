import { calculateTotalWordCount } from "@/utils/monthlyTotals";
import Manuscript from "../../data/testManuscripts/testManuscripts";

const test = [
  new Manuscript("test-1", 6000, 20),
  new Manuscript("test-2", 12000, 250),
  new Manuscript("test-3", 3876, 0),
  new Manuscript("test-4", 2536, 0),
  new Manuscript("test-5", 1820, 6),
];

it('should return the sum of all wordcounts and author bios', () => {
    expect(calculateTotalWordCount(test)).toBe(26508);
})