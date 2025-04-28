import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan class names menggunakan clsx dan twMerge untuk Tailwind CSS.
 * @param {...(string | object | Array<string | object>)} inputs - Class names atau objek kondisional.
 * @returns {string} Class names yang sudah digabungkan.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Konstanta untuk status task.
 * @type {{ TODO: string, ONGOING: string, DONE: string }}
 */
export const STATUS = {
  TODO: "To Do",
  ONGOING: "Ongoing",
  DONE: "Done",
};

/**
 * Konstanta untuk prioritas task.
 * @type {{ URGENT: string, HIGH: string, MEDIUM: string, LOW: string }}
 */
export const PRIORITY = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

/**
 * Mendapatkan array class Tailwind CSS untuk gradient berdasarkan prioritas task.
 * Gradient akan berakhir dengan transparansi (to-transparent).
 * @param {string} priority - Prioritas task (URGENT, HIGH, MEDIUM, LOW).
 * @returns {string[]} Array class Tailwind CSS untuk gradient.
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case PRIORITY.URGENT:
      return ["from-red-600", "via-red-500", "to-red-600", "to-transparent"];
    case PRIORITY.HIGH:
      return [
        "from-violet-600",
        "via-purple-500",
        "to-purple-600",
        "to-transparent",
      ];
    case PRIORITY.MEDIUM:
      return ["from-blue-600", "via-blue-500", "to-blue-600", "to-transparent"];
    case PRIORITY.LOW:
      return ["from-teal-600", "via-teal-500", "to-teal-600", "to-transparent"];
    default:
      return [
        "from-slate-600",
        "via-slate-500",
        "to-slate-600",
        "to-transparent",
      ];
  }
};

/**
 * Mendapatkan class Tailwind CSS untuk warna teks berdasarkan prioritas task.
 * @param {string} priority - Prioritas task (URGENT, HIGH, MEDIUM, LOW).
 * @returns {string} Class Tailwind CSS untuk warna teks.
 */
export const getPriorityTextColor = (priority) => {
  switch (priority) {
    case PRIORITY.URGENT:
    case PRIORITY.HIGH:
    case PRIORITY.MEDIUM:
    case PRIORITY.LOW:
      return "text-white";
    default:
      return "text-gray-800";
  }
};

/**
 * Mendapatkan array prioritas yang valid.
 * @returns {string[]} Array prioritas yang valid.
 */
export const getValidPriorities = () => {
  return Object.values(PRIORITY);
};

/**
 * Memeriksa apakah prioritas valid.
 * @param {string} priority - Prioritas task (URGENT, HIGH, MEDIUM, LOW).
 * @returns {boolean} True jika prioritas valid, false jika tidak.
 */
export const isValidPriority = (priority) => {
  return getValidPriorities().includes(priority);
};

/**
 * Mendapatkan class Tailwind CSS untuk badge prioritas.
 * @param {string} priority - Prioritas task (URGENT, HIGH, MEDIUM, LOW).
 * @returns {string[]} Array class Tailwind CSS untuk badge.
 */
export const getPriorityBadgeStyles = (priority) => {
  switch (priority) {
    case PRIORITY.URGENT:
      return ["bg-red-600", "hover:bg-red-700", "text-white"];
    case PRIORITY.HIGH:
      return ["bg-violet-600", "hover:bg-violet-700", "text-white"];
    case PRIORITY.MEDIUM:
      return ["bg-blue-600", "hover:bg-blue-700", "text-white"];
    case PRIORITY.LOW:
      return ["bg-teal-600", "hover:bg-teal-700", "text-white"];
    default:
      return ["bg-slate-600", "hover:bg-slate-700", "text-gray-800"];
  }
};

/**
 * Mendapatkan class Tailwind CSS untuk badge status.
 * @param {string} status - Status task (To Do, Ongoing, Done).
 * @returns {string[]} Array class Tailwind CSS untuk badge.
 */
export const getStatusBadgeStyles = (status) => {
  switch (status) {
    case STATUS.TODO:
      return ["bg-blue-300", "hover:bg-blue-400", "text-white"];
    case STATUS.ONGOING:
      return ["bg-blue-500", "hover:bg-blue-600", "text-white"];
    case STATUS.DONE:
      return ["bg-blue-900", "hover:bg-blue-800", "text-white"];
    default:
      return ["bg-gray-200", "hover:bg-gray-300", "text-gray-700"];
  }
};

/**
 * Mendapatkan pesan flash dari parameter props.
 * @param {{ props?: { flash_message?: string } }} params - Objek parameter yang berisi props.
 * @returns {string | undefined} Pesan flash, atau undefined jika tidak ada.
 */
export function getFlashMessage(params) {
  return params?.props?.flash_message;
}
