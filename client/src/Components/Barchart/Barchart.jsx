import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function Barchart() {
  // Chart options
  const options = {
    xAxis: {
      type: 'category',
      data: [
        '12/28/2024',
        '12/27/2024',
        '12/26/2024',
        '12/25/2024',
        '12/24/2024',
        '12/23/2024',
        '12/22/2024',
      ], // Dates in descending order
      axisLabel: {
        rotate: 0, // Rotate labels for better visibility
      },
    },
    yAxis: {
      type: 'value',
      name: '', // Label for the y-axis
    },
    series: [
      {
        data: [0, 0, 0, 0, 0, 0, 0], // Rainfall data corresponding to each date
        type: 'bar',
        itemStyle: {
          color: '#73C0DE', // Bar color for rainfall
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow', // Tooltip shadow for bars
      },
    },
  };
  
  

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Rainfall (mm)</h2>
      <ReactECharts option={options} style={{ height: 400, width: '100%' }} />
    </div>
  );
}
