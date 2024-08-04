import React from 'react';
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
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
      text: 'Ressources sells in tonnes.',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Wheat',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: '#ffd01a',
      backgroundColor: '#ffd01ac4',
    },
    {
      label: 'Corn',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: '#ff7b1a',
      backgroundColor: '#ff7b1aed',
    },
  ],
};

export default function App() {
  return <Line options={options} data={data} />;
}
