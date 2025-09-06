import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

type Props = {
  data: { time: number; close: number }[];
};

export const CryptoPriceChart = ({ data }: Props) => {
  const chartData = {
    datasets: [
      {
        label: "Precio (USD)",
        data: data.map((point) => ({
          x: new Date(point.time * 1000), // timestamp a Date
          y: point.close,
        })),
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "hour" as const,
        },
        title: {
          display: true,
          text: "Hora",
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Precio (USD)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
