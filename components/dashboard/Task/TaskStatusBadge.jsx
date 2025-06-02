import { STATUS } from "@/lib/utils";

export function TaskStatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case STATUS.TODO:
        return "bg-[#354273] text-white";
      case STATUS.ONGOING:
        return "bg-[#5171C7] text-white";
      case STATUS.DONE:
        return "bg-[#BBB1E0] text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case STATUS.TODO:
        return "To Do";
      case STATUS.ONGOING:
        return "Ongoing";
      case STATUS.DONE:
        return "Done";
      default:
        return "Unknown";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {getStatusLabel()}
    </span>
  );
}
