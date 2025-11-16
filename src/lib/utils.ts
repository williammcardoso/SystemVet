import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: string, timeString?: string) => {
  if (!dateString) return "N/A";
  const [year, month, day] = dateString.split('-');
  if (timeString) {
    return `${day}/${month}/${year} ${timeString}`;
  }
  return `${day}/${month}/${year}`;
};