import { STATUS } from "@/lib/utils";

export function TaskStatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case STATUS.TODO:
        return "bg-blue-500 text-white";
      case STATUS.ONGOING:
        return "bg-blue-600 text-white";
      case STATUS.DONE:
        return "bg-blue-800 text-white";
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
