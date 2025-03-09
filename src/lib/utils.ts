
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Pet } from "./types";

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

// Store pet data in localStorage for retrieval after login
export function storeTemporaryPetData(pet: Pet): void {
  try {
    localStorage.setItem('tempPetData', JSON.stringify(pet));
    console.log('Temporary pet data stored:', pet);
  } catch (error) {
    console.error('Failed to store temporary pet data:', error);
  }
}

// Retrieve pet data from localStorage
export function getTemporaryPetData(): Pet | null {
  try {
    const data = localStorage.getItem('tempPetData');
    if (data) {
      const petData = JSON.parse(data) as Pet;
      console.log('Retrieved temporary pet data:', petData);
      return petData;
    }
  } catch (error) {
    console.error('Failed to retrieve temporary pet data:', error);
  }
  return null;
}

// Clear temporary pet data
export function clearTemporaryPetData(): void {
  try {
    localStorage.removeItem('tempPetData');
    console.log('Temporary pet data cleared');
  } catch (error) {
    console.error('Failed to clear temporary pet data:', error);
  }
}

// Check for storage quota - to help warn users before storage is full
export async function checkStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percentUsed: number;
}> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = quota === 0 ? 0 : Math.round((usage / quota) * 100);
      
      return { usage, quota, percentUsed };
    }
    
    // Fallback for browsers without Storage API support
    return { usage: 0, quota: 0, percentUsed: 0 };
  } catch (error) {
    console.error('Error checking storage quota:', error);
    return { usage: 0, quota: 0, percentUsed: 0 };
  }
}

// Format bytes to human readable format
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
