
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isPlatform(platform: 'capacitor' | 'web'): boolean {
  // Check if we're running in Capacitor
  if (platform === 'capacitor') {
    return typeof window !== 'undefined' && 
           'Capacitor' in window && 
           (window as any).Capacitor && 
           (window as any).Capacitor.isNativePlatform();
  }
  
  // Default to web platform
  return true;
}
