// this file will give us all the dates we need to determine pay periods and filter through the manuscripts easily

import { ManuscriptType } from "@/types/manuscripts";

export function currentDates(): [Date, number, number, number] {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();

  return [currentDate, currentMonth, currentYear, currentDay];
}

// returns the start date of current pay period
export function determineStartDate(month: number, year: number, day: number) {
  let startDate;
  day <= 20
    ? (startDate = new Date(year, month - 1, 21))
    : (startDate = new Date(year, month, 21));
  return startDate;
}

// give this pay period's start date to get last pay period's start date
export function determinePrevMonthStartDate(date: Date): Date {
  const previousMonthDate = new Date(date);
  const currentDay = date.getDate();
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  previousMonthDate.setDate(currentDay);
  return previousMonthDate;
}

// returns the end date of current pay period
export function determineEndDate(month: number, year: number, day: number) {
  let endDate;
  day < 20
    ? (endDate = new Date(year, month, 20))
    : (endDate = new Date(year, month + 1, 20));
  return endDate;
}

// returns filtered array of manuscripts for a given pay period
export function payPeriodFilter(
  arr: ManuscriptType[],
  month: number,
  year: number,
  day: number
) {
  let startDate = determineStartDate(month, year, day);
  let endDate = determineEndDate(month, year, day);

  return arr.filter((obj) => {
    const objDate = new Date(obj.date);
    return objDate >= startDate && objDate <= endDate;
  });
}

// returns filtered array of manuscripts for a given day
export function dayFilter(
  arr: ManuscriptType[],
  month: number,
  year: number,
  day: number
) {
  return arr.filter((obj) => {
    const objDate = new Date(obj.date);
    const objMonth = objDate.getMonth();
    const objYear = objDate.getFullYear();
    const objDay = objDate.getDate();
    return objMonth === month && objYear === year && objDay === day;
  });
}

//does not require manuscripts
export function payPeriodDays(dateObj: Date) {
  //get the day/month/year from the date passed

  let month: number = dateObj.getMonth();
  let day: number = dateObj.getDate();
  let year: number = dateObj.getFullYear();

  let start = determineStartDate(month, year, day);
  console.log("pay period day: ", day, month, year);
  console.log("start date: ", start.toLocaleString());

  let end = determineEndDate(month, year, day);
  console.log("end date: ", end.toLocaleString());
  let days = [];

  let currentDatePointer = new Date(start);

  while (currentDatePointer <= end) {
    days.push(new Date(currentDatePointer));

    if (currentDatePointer.getDate() === getDaysInMonth(year, month)) {
      // Transition to the next month
      if (month === 11) {
        currentDatePointer = new Date(year + 1, 0, 1);
      } else {
        currentDatePointer = new Date(year, month + 1, 1);
      }
    } else {
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }
  }

  return days;
}

export function getDaysInMonth(year: number, month: number) {
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Get the date component of the last day
  // This gives us the total number of days in the current month
  const daysInMonth = lastDayOfMonth.getDate();

  return daysInMonth;
}

export const [currentDate, currentMonth, currentYear, currentDay] =
  currentDates();

export const thisMonthStartDate = determineStartDate(
  currentMonth,
  currentYear,
  currentDay
);

export const lastMonthStartDate =
  determinePrevMonthStartDate(thisMonthStartDate);
