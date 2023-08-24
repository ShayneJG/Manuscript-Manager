import { calculateTotalBonus } from "@/utils/monthlyTotals";
import Manuscript from "@/data/testManuscripts/testManuscripts";
import { ManuscriptType } from "@/types/manuscripts";

const test: ManuscriptType[] = [
    new Manuscript('test-1', 1000, 200, undefined, false, true, false, 10),
    new Manuscript('test-2', 2000, 200, undefined, false, false, false, 5),
    new Manuscript('test-3', 1500, 200, undefined, false, false, false, 20),
]

//TODO: finish this unit test. 