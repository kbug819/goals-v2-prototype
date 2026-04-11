interface ScaleProgressProps {
  levels: string[];
  baseline: string;
  current: string;
  target: string;
}

function formatLabel(level: string) {
  return level.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ScaleProgress({ levels, baseline, current, target }: ScaleProgressProps) {
  const baselineIdx = levels.indexOf(baseline);
  const currentIdx = levels.indexOf(current);
  const targetIdx = levels.indexOf(target);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>Baseline: {formatLabel(baseline)}</span>
        <span>Target: {formatLabel(target)}</span>
      </div>
      <div className="flex gap-1">
        {levels.map((level, idx) => {
          let color = "bg-gray-200";
          if (idx <= currentIdx && idx >= baselineIdx) color = "bg-indigo-400";
          if (idx === currentIdx) color = "bg-indigo-600";
          if (idx === targetIdx && idx > currentIdx) color = "bg-indigo-200 border-2 border-dashed border-indigo-400";

          return (
            <div key={level} className="flex-1 text-center">
              <div className={`h-3 rounded ${color} transition-colors`} />
              <div className={`text-[10px] mt-1 ${idx === currentIdx ? "font-bold text-indigo-700" : "text-gray-400"}`}>
                {formatLabel(level)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
