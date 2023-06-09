/*


*/

//this function calculates the percentage between two numbers, and returns the result as a number
//this is mainly used for calculating the increase/decrease in Summary comparisons

export function getPercentageChange(current: number, previous: number) {
  let result = ((current - previous) / previous) * 100;
  return roundLimit(result);
}
//this function rounds a given number to two decimal places and is used pretty much everywhere
export function roundLimit(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
