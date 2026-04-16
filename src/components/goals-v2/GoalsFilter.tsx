"use client";

import { GoalStatus } from "@/data/mockData";

interface GoalsFilterProps {
  activeFilter: GoalStatus | "all";
  onFilterChange: (filter: GoalStatus | "all") => void;
  counts: Record<string, number>;
  disciplines: string[];
  activeDiscipline: string | "all";
  onDisciplineChange: (discipline: string | "all") => void;
}

const filters: { value: GoalStatus | "all"; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "met", label: "Met" },
  { value: "discontinued", label: "Discontinued" },
  { value: "all", label: "All" },
];

export default function GoalsFilter({ activeFilter, onFilterChange, counts, disciplines, activeDiscipline, onDisciplineChange }: GoalsFilterProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      {/* Discipline filter */}
      {disciplines.length > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDisciplineChange("all")}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ring-1 ring-amber-200 ${
              activeDiscipline === "all"
                ? "bg-gray-800 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {disciplines.map((d) => (
            <button
              key={d}
              onClick={() => onDisciplineChange(d)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ring-1 ring-amber-200 ${
                activeDiscipline === d
                  ? "bg-gray-800 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Status filters */}
      <div className="flex items-center gap-1.5">
        {filters.map((filter) => {
          const count = filter.value === "all"
            ? Object.values(counts).reduce((a, b) => a + b, 0)
            : (counts[filter.value] || 0);

          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ring-1 ring-amber-200 ${
                activeFilter === filter.value
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {filter.label}
              <span className={`ml-1 text-xs ${
                activeFilter === filter.value ? "text-indigo-500" : "text-gray-400"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
