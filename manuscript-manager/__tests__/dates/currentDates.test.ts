import { currentDates } from "@/utils/dates"; 

describe('currentDates', () => {
  it('should return the current date, month, year, and day', () => {
    const [currentDate, currentMonth, currentYear, currentDay] = currentDates();

    // Assert the values based on the current date and time
    const now = new Date();
    expect(currentDate.getFullYear()).toBe(now.getFullYear());
    expect(currentDate.getMonth()).toBe(now.getMonth());
    expect(currentDate.getDate()).toBe(now.getDate());

    // Assert the individual values returned by currentDates()
    expect(currentMonth).toBe(now.getMonth());
    expect(currentYear).toBe(now.getFullYear());
    expect(currentDay).toBe(now.getDate());
  });
});
