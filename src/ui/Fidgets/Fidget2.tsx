import React from "react";
import clsx from "clsx";

type Fidget2Props = {
  title: string;
  figurePercentage?: number;
  figure1?: number;
  figure2?: number;
  figure1Text?: string;
  figure2Text?: string;
  policy?: string;
  loading?: boolean;
  className?: string;
  actions?: React.ReactNode;
};

export const Fidget2: React.FC<Fidget2Props> = ({
  title = "",
  figurePercentage = 0,
  figure1,
  figure1Text,
  figure2,
  figure2Text,
  policy,
  loading = false,
  className,
  actions,
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
          <div className="flex justify-between">
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            {actions}
          </div>
          {figurePercentage ? (
            <p className="text-3xl font-bold text-gray-900">
              {figurePercentage}%
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-800">
                {figure1Text} <span className="text-xl">{figure1}</span>
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {figure2Text} <span className="text-xl">{figure2}</span>
              </p>
            </>
          )}
          <span className="font-light text-xs text-gray-500">{policy}</span>
        </>
      )}
    </div>
  );
};
