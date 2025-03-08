import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  import { useMantineColorScheme } from '@mantine/core';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
  
  const BarChart = ({ chartData, onBarClick }) => {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          onBarClick(index);
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `₹ ${tooltipItem.raw.toLocaleString()}`,
          },
          backgroundColor: '#1F2937', // Dark mode background
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 12 },
          cornerRadius: 6,
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Categories',
            color: '#E5E7EB',
            font: { size: 14, weight: 'bold' },
          },
          ticks: {
            color: '#D1D5DB',
            font: { size: 12 },
          },
        },
        y: {
          title: {
            display: true,
            text: 'Amount (₹)',
            color: '#E5E7EB',
            font: { size: 14, weight: 'bold' },
          },
          ticks: {
            stepSize: 1000,
            color: '#D1D5DB',
            font: { size: 12 },
            maxTicksLimit: 6,
            callback: (value) => `₹ ${value.toLocaleString()}`,
          },
        },
      },
      animation: {
        duration: 1200,
        easing: 'easeOutQuart',
      },
      barThickness: 40,
      maxBarThickness: 50,
    };
  
    return (
      <div className={`border rounded-lg shadow-md p-4 bg-gray-800`} style={{ height: '400px', width: '100%' }}>
        <Bar data={chartData} options={options} />
      </div>
    );
  };
  
  export default BarChart;
  