"use client";

import { GoalStatus } from "@/data/mockData";

interface GoalsFilterProps {
  activeFilter: GoalStatus | "all";
  onFilterChange: (filter: GoalStatus | "all") => void;
  counts: Record<string, number>;
}

const filters: { value: GoalStatus | "all"; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "met", label: "Met" },
  { value: "discontinued", label: "Discontinued" },
];

export default function GoalsFilter({ activeFilter, onFilterChange, counts }: GoalsFilterProps) {
  return (
    <div className="flex items-center gap-2">
      {filters.map((filter) => {
        const count = filter.value === "all"
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : (counts[filter.value] || 0);

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              activeFilter === filter.value
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {filter.label}
            <span className={`ml-1.5 text-xs ${
              activeFilter === filter.value ? "text-indigo-500" : "text-gray-400"
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
