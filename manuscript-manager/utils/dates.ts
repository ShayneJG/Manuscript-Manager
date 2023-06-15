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
  day <= 20
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

export const [currentDate, currentMonth, currentYear, currentDay] =
  currentDates();

export const thisMonthStartDate = determineStartDate(
  currentMonth,
  currentYear,
  currentDay
);

export const lastMonthStartDate =
  determinePrevMonthStartDate(thisMonthStartDate);
