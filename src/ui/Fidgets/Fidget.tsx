import React from "react";
import clsx from "clsx";
import { Icons } from "../Icons/icon";

type FidgetProps = {
  title: string;
  figure: number;
  growthPercentage?: number;
  status?: "growth" | "degrowth" | "neutral";
  loading?: boolean;
  className?: string;
};

const growthIndicator = {
  growth: <Icons.Growth />,
  degrowth: <Icons.Degrowth />,
  neutral: "-",
};

export const Fidget: React.FC<FidgetProps> = ({
  title = "",
  figure = 0,
  growthPercentage = 0,
  loading = false,
  className,
}) => {
  return (
    <div
      className={clsx(
        "rounded-xl bg-white p-5 shadow-sm border border-gray-200",
        "flex flex-col gap-3",
        loading && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 font-medium">{title}</p>

          <p className="text-3xl font-bold text-gray-900">{figure}</p>

          {growthPercentage !== undefined && (
            <div className="flex items-center gap-1 text-sm font-medium">
              <span>
                {growthPercentage < 0
                  ? growthIndicator.degrowth
                  : growthPercentage === 0
                  ? growthIndicator.neutral
                  : growthIndicator.growth}
              </span>
              <span>{growthPercentage}%</span>
              <span className="text-gray-400"> vs last month</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
