type ChartBoxProps = {
  className?: string;
  children: React.ReactNode;
};

export const ChartBox = ({ className, children }: ChartBoxProps) => {
  return (
    <div
      className={`bg-white p-4 w-full min-h-90 rounded-xl shadow ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
};
