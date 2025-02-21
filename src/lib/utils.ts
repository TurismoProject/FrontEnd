import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function safeAsync<T, E = Error>(
  promise: Promise<T>
): Promise<[null, T] | [E, null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (e) {
    return [e as E, null];
  }
}

export function safeSync<T, E = Error>(
  fn: (...inputs: any[]) => T,
  ...inputs: any[]
): [null, T] | [E, null] {
  try {
    const result = fn(inputs);
    return [null, result];
  } catch (e) {
    return [e as E, null];
  }
}
