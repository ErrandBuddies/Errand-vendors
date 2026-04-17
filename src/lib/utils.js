import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error) {
  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((err) => err.message).join(", ");
  }
  return error.message || "An unexpected error occurred";
}

export const toGram = (kg) => kg * 1000;
export const toKg = (g) => g / 1000;
