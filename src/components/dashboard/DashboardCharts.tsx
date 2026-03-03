import type { CallStatisticsType } from "../../types/general.type";
import { BarChart, DoughnutChart, LineChart, ChartBox } from "../../ui";

type DashboardChartsProps = {
  data: CallStatisticsType | undefined
}

export const DashboardCharts = ({ data }:DashboardChartsProps ) => {
  if(!data) return;
  const barData = {
    labels: data.days ?? ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Calls",
        data: data.numberOfCalls ?? [12, 19, 8, 15, 10],
      },
    ],
  };

  const doughnutData = {
    labels: data.callTypes ?? ["Audio", "Video"],
    datasets: [
      {
        data: data.callTypeRatio ?? [60, 40],
      },
    ],
  };

  const lineData = {
    labels: data.months ?? ["Jan", "Feb", "Mar", "Apr", "May"],
    data: data.callCountPerMonth ?? [30, 45, 28, 60, 52],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <ChartBox className="w-full lg:col-span-8">
        <BarChart
          labels={barData.labels}
          data={barData.datasets[0].data}
          title={barData.datasets[0].label}
        />
      </ChartBox>

      <ChartBox className="w-full lg:col-span-4">
        <DoughnutChart
          labels={doughnutData.labels}
          data={doughnutData.datasets[0].data}
        />
      </ChartBox>

      <div className="lg:col-span-12 flex items-center">
        <ChartBox className="w-full">
          <LineChart labels={lineData.labels} data={lineData.data} />
        </ChartBox>
      </div>
    </div>
  );
};
