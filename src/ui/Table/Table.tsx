import type { Column } from "./Table.types";

type TableProps<T> = {
  columns: Column<T>[];
  data: T[] | undefined;
  loading?: boolean;
};

export function Table<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
}: TableProps<T>) {
  if (loading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (!data) {
    return <div className="p-4 text-gray-500">No data found</div>;
  }

  if (!data.length) {
    return <div className="p-4 text-gray-500">No data found</div>;
  }

  return (
    <div className="w-full min-w-0 overflow-x-auto rounded-lg border">
      <table className="min-w-full w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t hover:bg-gray-50 transition">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-4 py-2 text-sm ${col.className ?? ""}`}
                >
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
