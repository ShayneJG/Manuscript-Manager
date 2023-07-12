import { determineStartDate } from "@/utils/dates";

describe('determineStartDate', () => {
    it('should return the correct start date for days over 20', () => {
        const day = 23;
        const month = 11;
        const year = 2023;

        const result = determineStartDate(month, year, day)
        expect(result).toEqual(new Date(2023, 11, 21))
    })
    it('should return the correct start date for days under 20', () => {
        const day = 11;
        const month = 11;
        const year = 2023;

        const result = determineStartDate(month, year, day)
        expect(result).toEqual(new Date(2023, 10, 21))
    })
    it('should handle the 20th appropriately', () => {
        const day = 20;
        const month = 9;
        const year = 2023;

        const result = determineStartDate(month, year, day)
        expect(result).toEqual(new Date(2023, 8, 21));
    })
    it('should handle changing years', () => {
        const day = 1;
        const month = 1;
        const year = 2023;

        const result = determineStartDate(month, year, day)
        expect(result).toEqual(new Date(2022, 12, 21));
    })
})
