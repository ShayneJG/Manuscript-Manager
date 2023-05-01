/*


*/

//this function calculates the percentage between two numbers, and returns the result as a number
//this is mainly used for calculating the increase/decrease in Summary comparisons

function getPercentage(current: number, previous: number) {
  return previous - current - previous * 100;
}
//this function rounds a given number to two decimal places and is used pretty much everywhere
function roundLimit(num: number): number {
  return Math.round(num * 100) / 100;
}
