import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: '',
    },
  },
};


export default function BarChart({
  labels,data
}:{labels:string[],data:number[]}){
    return (
      <Bar
      data={
        {
          labels,
          datasets: [
            {
              label: '',
              data,
              backgroundColor: 'rgba(54, 162, 235, 0.5)', // Bar color
            },
          ]

        }
      }
      options={{
        responsive: true,
      }}
    />
    )
}