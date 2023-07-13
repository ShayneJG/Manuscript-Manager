import { ManuscriptType } from "@/types/manuscripts";
import {
  determineStartDate,
  determineEndDate,
  payPeriodFilter,
} from "@/utils/dates";
import {jest} from '@jest/globals';

describe("payPeriodFilter", () => {
  //mocking start and end date functions

  

  
  //test
  
  test("returns an array of manuscripts filtered by pay period", () => {
    //arrange
    jest.mock('@/utils/dates', () => ({
        determineStartDate: jest.fn().mockReturnValue(new Date(2023, 3, 21)),
        determineEndDate: jest.fn().mockReturnValue(new Date(2023, 4, 20)),
      }));
    const manuscripts: ManuscriptType[] = [
      {
        user: "shayne geilman",
        payrate: 0.0071,
        date: "2023-04-19T00:00:00.000+00:00",
        manuscriptID: "date test 1 out of bounds",
        wordCount: 4000,
        latex: false,
        double: false,
        triple: false,
        bonus: 0,
        turnAround: "04:00:00",
        authorBio: 0,
        createdAt: "2023-03-24T14:31:35.794+00:00",
      },
      {
        user: "shayne geilman",
        payrate: 0.0071,
        date: "2023-04-21T00:00:00.000+00:00",
        manuscriptID: "date test 2",
        wordCount: 4000,
        latex: false,
        double: false,
        triple: false,
        bonus: 0,
        turnAround: "04:00:00",
        authorBio: 0,
        createdAt: "2023-03-24T14:31:35.794+00:00",
      },
      {
        user: "shayne geilman",
        payrate: 0.0071,
        date: "2023-04-25T00:00:00.000+00:00",
        manuscriptID: "date test 3",
        wordCount: 4000,
        latex: false,
        double: false,
        triple: false,
        bonus: 0,
        turnAround: "04:00:00",
        authorBio: 0,
        createdAt: "2023-03-24T14:31:35.794+00:00",
      },
      {
        user: "shayne geilman",
        payrate: 0.0071,
        date: "2023-05-19T00:00:00.000+00:00",
        manuscriptID: "date test 4",
        wordCount: 4000,
        latex: false,
        double: false,
        triple: false,
        bonus: 0,
        turnAround: "04:00:00",
        authorBio: 0,
        createdAt: "2023-03-24T14:31:35.794+00:00",
      },
      {
        user: "shayne geilman",
        payrate: 0.0071,
        date: "2023-05-21T00:00:00.000+00:00",
        manuscriptID: "date test 5 out of bounds",
        wordCount: 4000,
        latex: false,
        double: false,
        triple: false,
        bonus: 0,
        turnAround: "04:00:00",
        authorBio: 0,
        createdAt: "2023-03-24T14:31:35.794+00:00",
      },
    ];

    const month = 3;
    const year = 2023;
    const day = 25;

    //act

    const result = payPeriodFilter(manuscripts, month, year, day);
    console.log(result)
    

    //assert

    

    expect(result).toEqual([
      {
        user: "shayne geilman",
        payrate: 0.0071,
        date: "2023-04-21T00:00:00.000+00:00",
        manuscriptID: "date test 2",
        wordCount: 4000,
        latex: false,
        double: false,
        triple: false,
        bonus: 0,
        turnAround: "04:00:00",
        authorBio: 0,
        createdAt: "2023-03-24T14:31:35.794+00:00",
      },
      {
        user: "shayne geilman",
        payrate: 0.0071,
        date: "2023-04-25T00:00:00.000+00:00",
        manuscriptID: "date test 3",
        wordCount: 4000,
        latex: false,
        double: false,
        triple: false,
        bonus: 0,
        turnAround: "04:00:00",
        authorBio: 0,
        createdAt: "2023-03-24T14:31:35.794+00:00",
      },
      {
        user: "shayne geilman",
        payrate: 0.0071,
        date: "2023-05-19T00:00:00.000+00:00",
        manuscriptID: "date test 4",
        wordCount: 4000,
        latex: false,
        double: false,
        triple: false,
        bonus: 0,
        turnAround: "04:00:00",
        authorBio: 0,
        createdAt: "2023-03-24T14:31:35.794+00:00",
      },
    ]);
    
    
  });
});
