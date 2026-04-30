import { create } from 'zustand';

export type Era = 'genesis' | 'industria' | 'singularity';

export interface CityState {
  era: Era;
  actionCount: number;
  incrementAction: () => void;
}

export const useCityStore = create<CityState>((set) => ({
  era: 'genesis',
  actionCount: 0,
  incrementAction: () =>
    set((state) => {
      const next = state.actionCount + 1;
      const era: Era = next >= 1000 ? 'singularity' : next >= 100 ? 'industria' : 'genesis';
      return { actionCount: next, era };
    }),
}));
