import React, { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Paper } from "@mantine/core";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import _ from "lodash";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const StackedBarChart = ({className, labels, datasets, title }) => {
  console.log(className)

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.dataset.label}: ₹${tooltipItem.raw.toFixed(2)}`,
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 22,
          weight: 'bold',
        },
        color: 'white',
        padding: {
          bottom: 25
        },
      },
      legend: {
        position: "bottom",
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
        stacked: true,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
       },
      y: { 
        stacked: true,
        title: {
          display: true,
          text: 'Amount (₹)',
          color: '#E5E7EB',
          font: { size: 14, weight: 'bold' },
        },
        ticks: {
          color: '#D1D5DB',
          font: { size: 12 },
          callback: (value) => `₹ ${value.toLocaleString()}`,
        },
      },
    },
  };

  const styles = {height: '80vh'}
  if(labels.length > 21){
    const w = labels.length*3.5
    styles['width'] =  `${w}vw`
  }

  return (
    <div className={"overflow-x-auto " + className}>
    <div style={styles} className={`border rounded-lg p-4 bg-gray-800`}>
      <Bar data={chartData} options={options} />
    </div>
    </div>
  );
};

export default StackedBarChart;
