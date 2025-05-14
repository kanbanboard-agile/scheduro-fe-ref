import { PRIORITY } from "@/lib/utils";

export function PriorityBadge({ priority }) {
  const getPriorityStyles = () => {
    switch (priority) {
      case PRIORITY.URGENT:
        return "bg-[#A21800] text-white";
      case PRIORITY.HIGH:
        return "bg-[#CA4848] text-white";
      case PRIORITY.MEDIUM:
        return "bg-[#E8A87C] text-white";
      case PRIORITY.LOW:
        return "bg-[#8FB350] text-white";
      default:
        return "bg-gray-200 text-gray-800"; // Gaya default untuk prioritas tidak valid
    }
  };

  const getPriorityLabel = () => {
    if (Object.values(PRIORITY).includes(priority)) {
      return priority.charAt(0).toUpperCase() + priority.slice(1);
    }
    return "Unknown"; // Label default untuk prioritas tidak valid
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyles()}`}
    >
      {getPriorityLabel()}
    </span>
  );
}
