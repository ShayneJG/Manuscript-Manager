import { ManuscriptType } from "@/types/manuscripts";
import { determineEndDate, determineStartDate } from "@/utils/dates";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';


  //chart.js has tree-shaking, so by registering these elements, we can reduce the amount of code at build time, i.e., the only parts of chart.js that make it into the production build will be the parts we use. 
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


  //Data needs to be grabbed via serversideprops and passed. 
interface MonthlyEarningsProps {
    currentMonth: ManuscriptType[],
    previousMonth: ManuscriptType[]
}

//chart for the profile page. Will break down and show monthly earnings. 
export default function MonthlyEarnings({currentMonth, previousMonth}: MonthlyEarningsProps)  {
    

    //collecting data for current month - storing in state. 

    





}