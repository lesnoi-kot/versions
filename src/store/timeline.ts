import { create } from "zustand";
import { combine } from "zustand/middleware";

export const DEFAULT_ZOOM = 1;
export const MAX_ZOOM = 20000;

export const useZoomSettings = create(
  combine({ zoom: DEFAULT_ZOOM }, (set) => ({
    reset: () => set(() => ({ zoom: DEFAULT_ZOOM })),
    increase: () =>
      set((state) => ({
        zoom: Math.min(MAX_ZOOM, state.zoom * 1.5),
      })),
    decrease: () =>
      set((state) => ({
        zoom: Math.max(DEFAULT_ZOOM, state.zoom / 1.5),
      })),
    setValue: (value: number) =>
      set(() => ({ zoom: Math.min(Math.max(value, DEFAULT_ZOOM), MAX_ZOOM) })),
  }))
);
