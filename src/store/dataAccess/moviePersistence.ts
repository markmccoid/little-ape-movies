import { listSavedShowIds } from "./movieDatabase";

export const getSavedShowIds = (userId: string): Set<number> => new Set(listSavedShowIds(userId));
