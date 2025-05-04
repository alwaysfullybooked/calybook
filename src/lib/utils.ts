import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * SHA-256 hash function using the Web Crypto API instead of Node's crypto
 * This is compatible with Edge Runtime
 */
async function sha256Hash(message: string): Promise<string> {
  // Encode the message as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // Generate hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  // Convert hash to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
