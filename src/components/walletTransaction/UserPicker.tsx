import { useState } from "react";
import { Button, Input } from "../../ui";
import { useUserQuery } from "../../hooks/query/useUser";
import { useDebounce } from "../../hooks/useDebounce";

/** Picked accounts, id → display name, so names survive a new search. */
export type PickedUsers = Record<string, string>;

type UserPickerProps = {
  label: string;
  selected: PickedUsers;
  onChange: (next: PickedUsers) => void;
  role?: string;
  gender?: string;
  emptyText?: string;
};

export const UserPicker = ({ label, selected, onChange, role, gender, emptyText = "No users found." }: UserPickerProps) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useUserQuery({
    page: 1,
    pageSize: 100,
    search: debouncedSearch,
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    role,
    gender,
  });
  const users = data?.data ?? [];
  const selectedCount = Object.keys(selected).length;

  const toggle = (id: string, name: string) => {
    const next = { ...selected };
    if (next[id] !== undefined) delete next[id];
    else next[id] = name;
    onChange(next);
  };

  const selectVisible = () => {
    const next = { ...selected };
    for (const user of users) next[user.id] = user.name || user.phone;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <Input
        label={label}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name or phone"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Selected users: <strong>{selectedCount}</strong>
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={selectVisible}>
            Select Visible
          </Button>
          <Button variant="secondary" onClick={() => onChange({})}>
            Clear
          </Button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 p-2">
        {isLoading ? (
          <p className="px-2 py-3 text-sm text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="px-2 py-3 text-sm text-gray-500">{emptyText}</p>
        ) : (
          users.map((user) => (
            <label
              key={user.id}
              className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {user.name} <span className="text-xs font-normal text-gray-500">· {user.role}</span>
                </p>
                <p className="text-xs text-gray-500">{user.phone}</p>
              </div>
              <input
                type="checkbox"
                checked={selected[user.id] !== undefined}
                onChange={() => toggle(user.id, user.name || user.phone)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))
        )}
      </div>
    </div>
  );
};
