
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isPlatform(platform: 'capacitor' | 'web'): boolean {
  // Improved detection of Capacitor environment
  if (platform === 'capacitor') {
    try {
      return typeof window !== 'undefined' && 
             window.hasOwnProperty('Capacitor') && 
             (window as any).Capacitor && 
             (window as any).Capacitor.isNativePlatform();
    } catch (error) {
      console.error("Error checking Capacitor platform:", error);
      return false;
    }
  }
  
  // Default to web platform
  return true;
}
