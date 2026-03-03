type DateFilterProps = {
  from?: string;
  to?: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
};

export const DateFilter = ({
  from,
  to,
  onFromChange,
  onToChange,
}: DateFilterProps) => {
  return (
    <div className="flex gap-3 items-center">
      <input
        type="date"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      />
      <span className="text-gray-500 text-sm">to</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onToChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      />
    </div>
  );
};
