import { ManuscriptType } from "@/types/manuscripts";
import  {payPeriodDays}  from "@/utils/dates";
import { calculateTotalEarnings } from "@/utils/monthlyTotals";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


  //chart.js has tree-shaking, so by registering these elements, we can reduce the amount of code at build time, i.e., the only parts of chart.js that make it into the production build will be the parts we use. 
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
export default function MonthlyEarningsChart({currentMonth, previousMonth}: MonthlyEarningsProps)  {
    


    

    


     
    const labels: Date[] = payPeriodDays(new Date());
    

    const currentManuscriptsByDate: {[date: string]: ManuscriptType[]}  = {}

    currentMonth.forEach((manuscript) => {
      const date = manuscript.date
      if(currentManuscriptsByDate[date]) {
        currentManuscriptsByDate[date].push(manuscript);
      } else {
        currentManuscriptsByDate[date] = [manuscript]
      }
    })

    const earnings: number[] = [];

    labels.forEach((date) => {
      const manuscripts = currentManuscriptsByDate[date.toString()] || [];

      if(manuscripts) {
        earnings.push(calculateTotalEarnings(manuscripts))
      } else {
        earnings.push(0)
      }
    })

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart',
        },
      },
    };

    

    const data = {
      labels,
      datasets: [
        {
          label: 'Current Month',
          data: earnings
        }
      ]
    }




}