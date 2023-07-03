import { ManuscriptType } from "@/types/manuscripts";
import { Chart } from "chart.js";
import { useEffect, useRef } from 'react';


interface MonthlyEarningsProps {
    data: ManuscriptType[]
}

//chart for the profile page. Will break down and show monthly earnings. 
export default function MonthlyEarnings({data}: MonthlyEarningsProps)  {
    const chartRef = useRef(null);

}