import { Bar } from "react-chartjs-2";
import "./chartConfig";

type BarChartProps = {
  labels: string[];
  data: number[];
  title?: string;
};

export const BarChart = ({ labels, data, title }: BarChartProps) => {
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: title || "Status",
            data,
            backgroundColor: "#3b82f6",
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
