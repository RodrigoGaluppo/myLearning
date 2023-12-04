import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


export default function PieChart({data,label}:{data:number[], label:string[]}){
  const colors = ['#FC8181', '#68D391', '#4FD1C5', '#B794F4', '#F6E05E', '#F687B3',
"#322659", "#521B41", "#065666", "#1A365D", "#1D4044", "#1C4532", "#5F370E", "#63171B"];
  
  return (
    <Pie 
    style={{color:"white"}}
    data={

      {
  
        labels: label,
        datasets: [
          {
            label: '#',
            data: data,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(53, 162, 235)',
              'rgb(245, 231, 66)'
            ],
            
            borderWidth: 1,
          },
        ],
      }

    }/>
  )
}