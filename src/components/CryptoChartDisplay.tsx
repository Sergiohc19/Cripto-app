// CryptoChartDisplay.tsx
import { useCryptoStore } from "../store";
import { Line, Bar } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
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

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  zoomPlugin // 👈 Plugin de zoom registrado
);

export const CryptoChartDisplay = () => {
  const chartData = useCryptoStore((state) => state.historyData);
  const pair = useCryptoStore((state) => state.pair);
  const period = useCryptoStore((state) => state.period);
  const setPeriod = useCryptoStore((state) => state.setPeriod);
  const fetchData = useCryptoStore((state) => state.fetchData);

  if (!pair?.currency || chartData.length === 0) {
    return null;
  }

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
        tension: 0.2,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: period === "24h" ? "hour" : period === "7d" ? "day" : "month",
          displayFormats: {
            hour: "HH:mm",
            day: "MMM d",
            month: "MMM yyyy",
          },
        },
        title: {
          display: true,
          text: "Fecha/Hora",
          color: "#182339",
          font: {
            weight: "bold",
            size: 18,
            family: "'Outfit', sans-serif",
          },
        },
        ticks: {
          maxTicksLimit: period === "24h" ? 24 : period === "7d" ? 7 : 6,
          autoSkip: true,
          color: "#182339",
          font: {
            weight: "bold",
            size: 16,
            family: "'Outfit', sans-serif",
          },
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: `Precio (${pair.currency})`,
          color: "#182339",
          font: {
            weight: "bold",
            size: 18,
            family: "'Outfit', sans-serif",
          },
        },
        ticks: {
          color: "#182339",
          font: {
            weight: "bold",
            size: 16,
            family: "'Outfit', sans-serif",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(24, 35, 57, 0.95)",
        borderColor: "#F0B90A",
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          weight: "bold",
          size: 18,
          family: "'Outfit', sans-serif",
        },
        bodyFont: {
          weight: "bold",
          size: 18,
          family: "'Outfit', sans-serif",
        },
        titleColor: "#ffffff",
        bodyColor: "#ffc403ff",
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ${pair.currency}`;
          },
        },
      },
      // 👇 PLUGIN DE ZOOM ACTIVADO
      zoom: {
        zoom: {
          wheel: {
            enabled: true, // Zoom con rueda del mouse
          },
          pinch: {
            enabled: true, // Zoom con gestos táctiles
          },
          mode: 'x', // Solo zoom horizontal (mejor para series de tiempo)
        },
        pan: {
          enabled: true, // Permitir arrastrar
          mode: 'x',      // Solo pan horizontal
        },
        limits: {
          x: { min: 'original', max: 'original' }, // Limitar zoom
        },
      },
    },
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: period === "24h" ? "hour" : period === "7d" ? "day" : "month",
          displayFormats: {
            hour: "HH:mm",
            day: "MMM d",
            month: "MMM yyyy",
          },
        },
        title: {
          display: true,
          text: "Fecha/Hora",
          color: "#182339",
          font: {
            weight: "bold",
            size: 18,
            family: "'Outfit', sans-serif",
          },
        },
        ticks: {
          maxTicksLimit: period === "24h" ? 12 : period === "7d" ? 7 : 4,
          autoSkip: true,
          color: "#182339",
          font: {
            weight: "bold",
            size: 16,
            family: "'Outfit', sans-serif",
          },
          align: period === "30d" ? "start" : "center",
        },
        offset: false,
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: `Precio (${pair.currency})`,
          color: "#182339",
          font: {
            weight: "bold",
            size: 18,
            family: "'Outfit', sans-serif",
          },
        },
        ticks: {
          color: "#182339",
          font: {
            weight: "bold",
            size: 16,
            family: "'Outfit', sans-serif",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(24, 35, 57, 0.95)",
        borderColor: "#F0B90A",
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          weight: "bold",
          size: 18,
          family: "'Outfit', sans-serif",
        },
        bodyFont: {
          weight: "bold",
          size: 18,
          family: "'Outfit', sans-serif",
        },
        titleColor: "#ffffff",
        bodyColor: "#ffc403ff",
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ${pair.currency}`;
          },
        },
      },
      // 👇 PLUGIN DE ZOOM ACTIVADO
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x', // Solo zoom horizontal
        },
        pan: {
          enabled: true,
          mode: 'x', // Solo pan horizontal
        },
        limits: {
          x: { min: 'original', max: 'original' },
        },
      },
    },
    elements: {
      bar: {
        categoryPercentage: 0.2,
        barPercentage: 0.5,
      },
    },
  };

  const handlePeriodChange = async (newPeriod: "24h" | "7d" | "30d") => {
    setPeriod(newPeriod);
    if (pair) {
      await fetchData(pair, newPeriod);
    }
  };

  return (
    <div className="chart-container">
      <div className="period-selector">
        <button
          className={period === "24h" ? "active" : ""}
          onClick={() => handlePeriodChange("24h")}
        >
          24h
        </button>
        <button
          className={period === "7d" ? "active" : ""}
          onClick={() => handlePeriodChange("7d")}
        >
          7d
        </button>
        <button
          className={period === "30d" ? "active" : ""}
          onClick={() => handlePeriodChange("30d")}
        >
          30d
        </button>
      </div>

      <h3>Gráfico de Línea</h3>
      <div className="chart-wrapper">
        <Line data={data} options={lineOptions} />
      </div>

      <h3>Gráfico de Barras</h3>
      <div className="chart-wrapper">
        <Bar data={data} options={barOptions} />
      </div>
    </div>
  );
};