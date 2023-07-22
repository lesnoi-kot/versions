import { create } from "zustand";
import { combine } from "zustand/middleware";
import { shallow } from "zustand/shallow";

export const useSources = create(
  combine(
    {
      selectedSources: [] as string[],
    },
    (set) => ({
      addSourceToGraph(id: string) {
        return set((state) => ({
          ...state,
          selectedSources: state.selectedSources.includes(id)
            ? state.selectedSources
            : state.selectedSources.concat(id),
        }));
      },
      deleteSourceFromGraph(idToDelete: string) {
        return set((state) => ({
          ...state,
          selectedSources: state.selectedSources.filter(
            (id) => id !== idToDelete
          ),
        }));
      },
    })
  )
);

export type State = ReturnType<(typeof useSources)["getState"]>;

export function useSelectedSourcesId(): string[] {
  return useSources((state) => state.selectedSources, shallow);
}
