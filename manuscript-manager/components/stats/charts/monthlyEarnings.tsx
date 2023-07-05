import { ManuscriptType } from "@/types/manuscripts";
import { payPeriodDays } from "@/utils/dates";
import { roundLimit } from "@/utils/math";
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
} from "chart.js";
import { Line } from "react-chartjs-2";

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
  manuscripts: ManuscriptType[];
  dateInPeriod: Date;
  label: string;
}

//chart for the profile page. Will break down and show monthly earnings.
export default function MonthlyEarningsChart({
  manuscripts,
  dateInPeriod,
  label,
}: MonthlyEarningsProps) {
  function earningsCalculator(labels: Date[], month: ManuscriptType[]) {
    // initiates variable that holds all the manuscripts, grouped under a date key.
    // this will allow us to calculate the earnings per day.
    // its format is this for visual reference:
    // {
    //   date: [manuscript, manuscript],
    //   date: [manuscript, manuscript],
    //   date: [manuscript, manuscript],
    //   etc...
    // }
    // where each date is unique, and represents all manuscripts done that day for the logged in user.
    const currentManuscriptsByDate: { [date: string]: ManuscriptType[] } = {};

    // this forEach will go through every manuscript of this pay period and place it in the
    // currentManuscriptsByDate. First manuscript of each date will create the key, any subsequent
    // manuscripts will be pushed into the array.
    month.forEach((manuscript) => {
      const date = manuscript.date.split("T")[0];
      //console.log("manuscript dates: ", date);
      if (currentManuscriptsByDate[date]) {
        currentManuscriptsByDate[date].push(manuscript);
      } else {
        currentManuscriptsByDate[date] = [manuscript];
      }
    });
    console.log("manuscripts grouped: ", currentManuscriptsByDate);

    const earnings: number[] = [];

    labels.forEach((date) => {
      //timezoneoffset is critical for the dates to work correctly. Shifting between the default
      //date and the ISO time sets the date to the day before. This is not accurate to all cases
      //but works for AUS.
      const timezoneOffset = date.getTimezoneOffset() * 60000; // Get timezone offset in milliseconds
      const searchDate = new Date(date.getTime() - timezoneOffset)
        .toISOString()
        .split("T")[0];
      //console.log("search date: ", searchDate);
      const dayManuscripts = currentManuscriptsByDate[searchDate] || null;

      if (dayManuscripts) {
        earnings.push(calculateTotalEarnings(dayManuscripts));
      } else {
        earnings.push(0);
      }
    });

    return earnings;
  }

  // retrieves all days in the month and stores the dates as default dates.
  const labels: Date[] = payPeriodDays(dateInPeriod);

  //console.log("labels: ", labels)

  const currentEarnings = earningsCalculator(labels, manuscripts);

  // shorter labels for readability.
  let shortLabels: string[] = labels.map((date) => {
    return date.toLocaleDateString().slice(0, 10);
  });

  // options for chart. Can add colour here.
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Monthly Earnings | total: \$${roundLimit(
          calculateTotalEarnings(manuscripts)
        )}`,
      },
    },
  };

  const data = {
    labels: shortLabels,
    datasets: [
      {
        label: `${label}`,
        data: currentEarnings,
        borderColor: "rgb(132, 99, 255)",
        backgroundColor: "rgba(132, 99, 255, 0.5)",
      },
    ],
  };

  return <Line data={data} options={options} />;
}
