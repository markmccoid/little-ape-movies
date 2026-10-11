import type { ImageColors } from "@/utils/color.utils";

export type ShowStreamingProviders = {
  dateAddedEpoch: number;
  providers: number[];
};

export type ShowItemType = {
  id: number;
  title: string;
  posterURL?: string;
  posterColors?: ImageColors;
  backdropURL?: string;
  releaseDateEpoch: number;
  dateAddedEpoch: number;
  genres: string[];
  rating: number;
  tags: string[];
  existsInSaved: boolean;
  streaming: ShowStreamingProviders;
  watched?: number;
  favorited?: number;
};

export type Tag = {
  id: string;
  name: string;
  dateAdded: number;
  pos: number;
};

type MovieId = number;
type ToggleOptions = "toggle" | "on" | "off";

// Action-bar edits stay here until the bar closes, so the list does not
// re-query and re-sort on every tap.
export type PendingChanges = Record<
  MovieId,
  { watched?: ToggleOptions; favorited?: ToggleOptions; rating?: number; tags?: string[] }
>;

export const updateTagState = (tags: Tag[], appliedTagIds: string[]) => {
  const appliedTagSet = new Set(appliedTagIds);
  return tags.map((tag) => ({
    ...tag,
    applied: appliedTagSet.has(tag.id),
  }));
};

export type TagState = ReturnType<typeof updateTagState>[number];
