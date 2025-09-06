import { useCryptoStore } from "../store";
import { Line, Bar } from "react-chartjs-2";

import "../index.css";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";

// Registrar componentes de ChartJS
ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

export const CryptoChartDisplay = () => {
  // Obtener datos y moneda del store
  const chartData = useCryptoStore((state) => state.historyData);
  const pair = useCryptoStore((state) => state.pair);

  // Si no hay datos o moneda, no mostrar nada
  if (!pair?.currency || chartData.length === 0) {
    return null;
  }

  // Preparar datos para ChartJS (misma estructura para ambos)
  const data = {
    datasets: [
      {
        label: `Precio (${pair.currency})`,
        data: chartData.map((point) => ({
          x: new Date(point.time * 1000),
          y: point.close,
        })),
        borderColor: "#F0B90A",
        backgroundColor: "rgba(255, 153, 0, 0.98)",
        tension: 0.2, // sólo para línea
      },
    ],
  };

  // Opciones para gráfico de línea
  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: {
            hour: "HH:mm",
          },
        },
        title: {
          display: true,
          text: "Hora",
        },
        ticks: {
          maxTicksLimit: 36,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: `Precio (${pair.currency})`,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  // Opciones para gráfico de barras
  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: {
            hour: "HH:mm",
          },
        },
        title: {
          display: true,
          text: "Hora",
        },
        ticks: {
          maxTicksLimit: 36,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: `Precio (${pair.currency})`,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>Gráfico de Línea</h3>
      <Line data={data} options={lineOptions} />

      <h3>Gráfico de Barras</h3>
      <Bar data={data} options={barOptions} />
    </div>
  );
};
