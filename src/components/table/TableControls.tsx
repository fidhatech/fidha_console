import { SearchInput, Select, DateFilter, SortControl } from "../../ui";

type Option = {
  label: string;
  value: string;
};

type TableControlsProps = {
  searchEnable?: boolean;
  selectEnalbe?: boolean;
  dateFilterEnable?: boolean;
  sortEnable?: boolean;

  search: string;
  onSearchChange: (v: string) => void;

  role?: string;
  onRoleChange?: (v: string) => void;
  options?: Option[];

  fromDate?: string;
  toDate?: string;
  onFromDateChange?: (v: string) => void;
  onToDateChange?: (v: string) => void;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortByChange?: (v: string) => void;
  onSortOrderChange?: (v: "asc" | "desc") => void;
  sortOptions?: { label: string; value: string }[];
};

export const TableControls = ({
  searchEnable = true,
  selectEnalbe = false,
  dateFilterEnable = false,
  search,
  onSearchChange,
  role,
  onRoleChange = () => {},
  options = [{ label: "All", value: "all" }],
  fromDate,
  toDate,
  onFromDateChange = () => {},
  onToDateChange = () => {},

  sortEnable,
  sortBy = "",
  sortOrder = "asc",
  onSortByChange = () => {},
  onSortOrderChange = () => {},
  sortOptions = [{ label: "All", value: "all" }],
}: TableControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-4">
      {searchEnable && <SearchInput value={search} onChange={onSearchChange} />}

      {selectEnalbe && (
        <Select value={role || ""} onChange={onRoleChange} options={options} />
      )}

      {dateFilterEnable && (
        <DateFilter
          from={fromDate}
          to={toDate}
          onFromChange={onFromDateChange}
          onToChange={onToDateChange}
        />
      )}

      {sortEnable && (
        <SortControl
          sortBy={sortBy}
          sortOrder={sortOrder}
          options={sortOptions}
          onSortByChange={onSortByChange}
          onSortOrderChange={onSortOrderChange}
        />
      )}
    </div>
  );
};
