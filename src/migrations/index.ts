import * as migration_20260920_201514_initial from './20260920_201514_initial';

export const migrations = [
  {
    up: migration_20260920_201514_initial.up,
    down: migration_20260920_201514_initial.down,
    name: '20260920_201514_initial'
  },
];
