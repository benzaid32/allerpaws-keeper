
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
