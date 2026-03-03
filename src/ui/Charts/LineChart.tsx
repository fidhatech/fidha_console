import { Line } from "react-chartjs-2";
import "./chartConfig";

type LineChartProps = {
  labels: string[];
  data: number[];
  title?: string;
};

export const LineChart = ({ labels, data, title }: LineChartProps) => {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: title || "Trend",
            data,
            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.2)",
            tension: 0.4, // smooth curve
            fill: true,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
        },
      }}
    />
  );
};
