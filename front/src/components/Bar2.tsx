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
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Quantities of ressources',
    },
  },
};

const labels = ['Vegetables', 'Meat', 'Dairy product', 'Others'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Quantities',
      data: labels.map(() => faker.datatype.number({ min: 500, max: 1000 })),
      backgroundColor: 'rgba(153, 102, 255, 0.8)',
    },
  ],
};

export default function App() {
  return <Bar options={options} data={data} />;
}
