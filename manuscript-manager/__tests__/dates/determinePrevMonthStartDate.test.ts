import { determinePrevMonthStartDate } from "@/utils/dates";

test('determinePrevMonthStartDate returns the correct previous month start date', () => {
    // Arrange
    const inputDate = new Date(2023, 6, 21);
  
    // Act
    const result = determinePrevMonthStartDate(inputDate);
  
    // Assert
    expect(result).toEqual(new Date(2023, 5, 21));
  });