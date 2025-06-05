import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add UTR to NTRP conversion function
export const convertUTRtoNTRP = (utr: string): string => {
  const utrNum = Number.parseFloat(utr);

  if (Number.isNaN(utrNum)) return "N/A";

  // Conversion ranges based on general guidelines
  if (utrNum >= 15.0) return "7.0";
  if (utrNum >= 13.0) return "6.5";
  if (utrNum >= 11.0) return "6.0";
  if (utrNum >= 9.0) return "5.5";
  if (utrNum >= 7.0) return "5.0";
  if (utrNum >= 5.0) return "4.5";
  if (utrNum >= 3.0) return "4.0";
  if (utrNum >= 2.0) return "3.5";
  if (utrNum >= 1.0) return "3.0";

  return "2.5";
};
