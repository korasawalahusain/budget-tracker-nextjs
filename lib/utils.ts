import { Message } from "@types";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ),
  );
}

export async function fetchWrapper<D = any>({
  init,
  input,
  onError,
  onSuccess,
}: {
  init?: RequestInit;
  input: RequestInfo | URL;
  onSuccess?: (data: D) => void;
  onError?: (errors: Message[]) => void;
}): Promise<D | null> {
  const response = await fetch(input, init);
  const response_1 = await response.json();
  if (response_1.success && response_1.data) {
    onSuccess?.(response_1.data);
    return response_1.data;
  } else {
    if (response_1.errors?.length) onError?.(response_1.errors);
  }
  return null;
}
