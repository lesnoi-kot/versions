import { create } from "zustand";
import { combine } from "zustand/middleware";
import { shallow } from "zustand/shallow";

export type DisplayType = "major" | "minor" | "all";

type Setting = {
  monotonic: boolean;
  display: DisplayType;
};

const DEFAULT_SETTING = {
  monotonic: false,
  display: "all",
};

export const useDatasetsSettings = create(
  combine({} as Record<string, Setting>, (set, getState) => ({
    setSetting: (id: string, setting: Setting) =>
      set((state) => ({ ...state, [id]: setting })),
    getSetting: (id: string) => getState()[id] ?? DEFAULT_SETTING,
  }))
);

export function useDatasetSettings(id: string) {
  const setting = useDatasetsSettings((state) => state[id], shallow);

  return setting ?? DEFAULT_SETTING;
}
