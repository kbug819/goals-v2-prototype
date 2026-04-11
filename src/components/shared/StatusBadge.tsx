import { GoalStatus } from "@/data/mockData";

const statusStyles: Record<GoalStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  met: "bg-blue-100 text-blue-800",
  discontinued: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }: { status: GoalStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
