interface ProgressBarProps {
  current: number;
  target: number;
  baseline: number;
}

export default function ProgressBar({ current, target, baseline }: ProgressBarProps) {
  const range = target - baseline;
  const progress = range > 0 ? Math.min(((current - baseline) / range) * 100, 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Baseline: {baseline}%</span>
        <span>Current: {current}%</span>
        <span>Target: {target}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
