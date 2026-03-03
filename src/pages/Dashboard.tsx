import { DashboardFigure } from "../components/dashboard/DashboardFigure";
import { DashboardCharts } from "../components/dashboard/DashboardCharts";
import { useDashboardQuery } from "../hooks/query/useDashbaord";

const DashboardPage = () => {

  const { data } = useDashboardQuery();
  const chartData = data?.data.chartData;
  const fidgetData = data?.data.fidgetData;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardFigure
          data={fidgetData}
         />
      </div>
      <div className="mt-8">
        <DashboardCharts
          data={chartData}
         />
      </div>
    </div>
  );
};

export default DashboardPage;
