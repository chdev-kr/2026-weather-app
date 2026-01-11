import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  currentLocation: {
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  setCurrentLocation: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  clearCurrentLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentLocation: null,

      setCurrentLocation: (location) => {
        set({ currentLocation: location });
      },

      clearCurrentLocation: () => {
        set({ currentLocation: null });
      },
    }),
    {
      name: 'location-storage', // LocalStorage 키
    }
  )
);
