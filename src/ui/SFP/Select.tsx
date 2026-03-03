type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
};

export const Select = ({ value, options, onChange }: SelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border rounded-md"
    >
      {options.map((opt) => (
        <option key={opt.label} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
