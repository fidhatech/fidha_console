import type { SortOption } from "../../types/sort.type";

type SortControlProps = {
  sortBy: string;
  sortOrder: "asc" | "desc";
  options: SortOption[];
  onSortByChange: (value: string) => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
};

export const SortControl = ({
  sortBy,
  sortOrder,
  options,
  onSortByChange,
  onSortOrderChange,
}: SortControlProps) => {
  return (
    <div className="flex items-center gap-2">
      {/* Sort field */}
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="border rounded px-2 py-2 text-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort by {opt.label}
          </option>
        ))}
      </select>

      {/* Sort order */}
      <button
        type="button"
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        className="border rounded px-2 py-2 text-sm"
      >
        {sortOrder === "asc" ? "Asc" : "Desc"}
      </button>
    </div>
  );
};
