import { Doughnut } from "react-chartjs-2";
import "./chartConfig";

type DoughnutChartProps = {
  labels: string[];
  data: number[];
};

export const DoughnutChart = ({ labels, data }: DoughnutChartProps) => {
  return (
    <Doughnut
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: ["#22c55e", "#f97316", "#ef4444"],
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
      }}
    />
  );
};
