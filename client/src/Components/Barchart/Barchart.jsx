import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

export default function Barchart() {
  const [rainfallData, setRainfallData] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    fetch('https://iinms.brri.gov.bd/api/weather/rainfall?lat=21.1&lon=88.1')
      .then((response) => response.json())
      .then((data) => {
        const formattedDates = Object.keys(data.rainfall).map((date) => {
          return new Date(date).toLocaleDateString('en-US');
        });
        
        const values = Object.values(data.rainfall).map(value => parseFloat(value.toFixed(3)));
        
        setDates(formattedDates);
        setRainfallData(values);
      })
      .catch((error) => console.error('Error fetching rainfall data:', error));
  }, []);

  const options = {
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 0, // Rotate labels for better visibility
      },
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: rainfallData,
        type: 'bar',
        itemStyle: {
          color: '#73C0DE', // Bar color for rainfall
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
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