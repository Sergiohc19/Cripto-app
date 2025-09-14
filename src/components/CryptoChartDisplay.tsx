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

// Registrar componentes de Chart.js necesarios para renderizar gráficos
ChartJS.register(
  LineElement, // Para gráfico de línea
  BarElement, // Para gráfico de barras
  PointElement, // Para puntos en las líneas
  LinearScale, // Escala lineal vertical (eje Y)
  TimeScale, // Escala temporal horizontal (eje X)
  Tooltip, // Tooltip al pasar el mouse
  Legend // Leyenda (la ocultamos)
);

export const CryptoChartDisplay = () => {
  // 📥 Obtener datos históricos y par de cripto/moneda desde el store de Zustand
  const chartData = useCryptoStore((state) => state.historyData);
  const pair = useCryptoStore((state) => state.pair);

  // 🚫 Si no hay datos o moneda seleccionada, no mostrar nada
  if (!pair?.currency || chartData.length === 0) {
    return null;
  }

  // 📊 Preparar los datos para Chart.js
  const data = {
    datasets: [
      {
        label: `Precio (${pair.currency})`, // Etiqueta (no se muestra porque ocultamos leyenda)
        data: chartData.map((point) => ({
          x: new Date(point.time * 1000), // Convertimos timestamp (segundos) a objeto Date
          y: point.close, // Valor del precio de cierre
        })),
        borderColor: "#F0B90A", // Color de la línea: dorado de tu paleta
        backgroundColor: "rgba(255, 153, 0, 0.98)", // Relleno bajo la línea (muy opaco)
        tension: 0.2, // Suaviza la curva de la línea
      },
    ],
  };

  // ======================
  // 📈 OPCIONES PARA GRÁFICO DE LÍNEA
  // ======================
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
          color: "#182339", // ✅ Negro profundo de tu paleta (--black)
          font: {
            weight: "bold",
            size: 18,
            family: "'Outfit', sans-serif", // ✅ Fuente principal de tu app
          },
        },
        ticks: {
          maxTicksLimit: 24, // Limita a 24 marcas (una por hora)
          autoSkip: true,
          color: "#182339", // ✅ Números del eje X en negro
          font: {
            weight: "bold",
            size: 16,
            family: "'Outfit', sans-serif",
          },
        },
      },

      y: {
        beginAtZero: false, // No forzar el eje Y a empezar en 0 — crucial para precios de cripto
        title: {
          display: true,
          text: `Precio (${pair.currency})`,
          color: "#182339", // ✅ Negro profundo
          font: {
            weight: "bold",
            size: 18,
            family: "'Outfit', sans-serif",
          },
        },
        ticks: {
          color: "#182339", // ✅ ¡CLAVE! Números del eje Y en negro (antes faltaba)
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
        display: false, // Ocultamos leyenda porque solo hay una serie
      },

      tooltip: {
        mode: "index", // Muestra todos los valores en la misma hora
        intersect: false, // Muestra tooltip incluso si no estás justo encima del punto

        // Estilo visual del tooltip
        backgroundColor: "rgba(24, 35, 57, 0.95)", // Fondo oscuro, igual a tu --black
        borderColor: "#F0B90A", // Borde dorado — acento visual
        borderWidth: 1,
        cornerRadius: 8, // Esquinas redondeadas, estilo moderno

        // Fuente del título del tooltip
        titleFont: {
          weight: "bold",
          size: 18,
          family: "'Outfit', sans-serif",
        },

        // Fuente del cuerpo (valor del precio)
        bodyFont: {
          weight: "bold",
          size: 18,
          family: "'Outfit', sans-serif",
        },

        // ✅ COLOR DEL TEXTO EN EL TOOLTIP — ¡CORREGIDO!
        titleColor: "#ffffff", // Texto del título: blanco (contrasta con fondo oscuro)
        bodyColor: "#ffc403ff",

        displayColors: false, // Oculta los cuadritos de color (sobran aquí)

        // Formatea lo que se muestra en el tooltip
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ${
              pair.currency
            }`;
          },
        },
      },
    },
  };

  // ======================
  // 📊 OPCIONES PARA GRÁFICO DE BARRAS — MISMA CONFIGURACIÓN
  // ======================
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
          color: "#182339",
          font: {
            weight: "bold",
            size: 18,
            family: "'Outfit', sans-serif",
          },
        },
        ticks: {
          maxTicksLimit: 24,
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
          color: "#182339", // ✅ ¡CLAVE! Números del eje Y en negro
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

        // ✅ ¡CORREGIDO! Texto en blanco, no amarillo
        titleColor: "#ffffff",
        bodyColor: "#ffc403ff",
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ${
              pair.currency
            }`;
          },
        },
      },
    },
  };

  // ======================
  // 🖥️ RENDERIZADO FINAL
  // ======================
  return (
    <div className="chart-container">
      <h3>Gráfico de Línea</h3>
      <Line data={data} options={lineOptions} />

      <h3>Gráfico de Barras</h3>
      <Bar data={data} options={barOptions} />
    </div>
  );
};
