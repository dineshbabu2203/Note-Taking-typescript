import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return initialValue as T; // Ensure SSR safety
      const jsonValue = window.localStorage.getItem(key);
      if (jsonValue == null) {
        return typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue;
      } else {
        return JSON.parse(jsonValue);
      }
    } catch (error) {
      console.error("Error accessing localStorage", error);
      return initialValue as T;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Error setting localStorage", error);
    }
  }, [value, key]);

  return [value, setValue] as [T, typeof setValue];
}
