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
    previousMonth?: ManuscriptType[]
}

//chart for the profile page. Will break down and show monthly earnings. 
export default function MonthlyEarningsChart({currentMonth, previousMonth}: MonthlyEarningsProps)  {
    


    console.log("client-side manuscripts: ", currentMonth)

    


     
    const labels: Date[] = payPeriodDays(new Date());
    console.log("labels: ", labels)
    

    const currentManuscriptsByDate: {[date: string]: ManuscriptType[]}  = {}

    currentMonth.forEach((manuscript) => {
      const date = manuscript.date.split("T")[0]
      console.log("manuscript dates: ", date)
      if(currentManuscriptsByDate[date]) {
        currentManuscriptsByDate[date].push(manuscript);
      } else {
        currentManuscriptsByDate[date] = [manuscript]
      }
    })
    console.log("manuscripts grouped: ", currentManuscriptsByDate)

    const earnings: number[] = [];

    

    //console.log("snipped labels: ", labelShort)

    labels.forEach((date) => {
      //console.log("label for each: ", date)
      let searchDate = date.toISOString().split("T")[0]
      console.log("search date: ", searchDate)
      const manuscripts = currentManuscriptsByDate[searchDate] || null;
        //console.log("manuscript by date: ", manuscripts)

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

    console.log("earnings: ", earnings)
    
    let shortLabels: string[] = labels.map((date) => {
      return date.toLocaleDateString().slice(0, 10);
    })
    console.log("short label: ", shortLabels)
    
    const data = {
      labels: shortLabels,
      datasets: [
        {
          label: 'Current Month',
          data: earnings
        }
      ]
    }

    return (<Line data={data} options={options} />)


}