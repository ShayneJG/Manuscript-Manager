import { determineEndDate } from "@/utils/dates";


it('determineEndDate should provide the last day of a given pay period', () => {

    //arrange
    const month = 12;
    const day = 25;
    const year = 2023

    //act

    const result = determineEndDate(month, year, day);

    //assert

    expect(result).toEqual(new Date(2024, 1, 20))
})

it('determineEndDate should handle 20th', () => {

    //arrange
    const month = 12;
    const day = 20;
    const year = 2023

    //act

    const result = determineEndDate(month, year, day);

    //assert

    expect(result).toEqual(new Date(2023, 12, 20))
})

//had issues with this month in the past
it('determineEndDate should handle the 8th month', () => {

    //arrange
    const month = 8;
    const day = 25;
    const year = 2023

    //act

    const result = determineEndDate(month, year, day);

    //assert

    expect(result).toEqual(new Date(2023, 9, 20))
})