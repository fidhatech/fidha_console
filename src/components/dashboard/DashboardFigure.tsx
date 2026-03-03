import type { FidgetStatistics } from "../../types/general.type";
import { Fidget } from "../../ui";

type DashboardFigureProps = {
  data: FidgetStatistics[] | undefined;
}

export const DashboardFigure = ({ data }:DashboardFigureProps) => {
  if(!data) return <p>No Data</p>;
  return (
    <>
      {data.map((item) => (
        <Fidget
          key={item.title}
          title={item.title}
          figure={item.figure}
          growthPercentage={item.growth}
        />
      ))}
    </>
  );
};
