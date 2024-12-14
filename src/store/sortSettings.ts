import { SavedQuickSorts, SortField } from "./store.settings";
// filteredMovies[0].watched;
// filteredMovies[0].favorited;
// filteredMovies[0].title;
// filteredMovies[0].dateAddedEpoch;
// filteredMovies[0].rating;

export const defaultSortSettings: SortField[] = [
  {
    id: "userrating",
    sortField: "rating",
    title: "User Rating",
    sortDirection: "desc",
    active: true,
    type: "number",
    index: 0,
  },
  {
    id: "title",
    sortField: "title",
    title: "Title",
    sortDirection: "asc",
    active: true,
    type: "alpha",
    index: 1,
  },
  {
    id: "releaseDateepoch",
    sortField: "releaseDateEpoch",
    title: "Release Date",
    sortDirection: "desc",
    active: false,
    type: "number",
    index: 2,
  },
  {
    id: "dateaddedepoch",
    sortField: "dateAddedEpoch",
    title: "Date Added",
    sortDirection: "desc",
    active: false,
    type: "number",
    index: 3,
  },
  {
    id: "datewatched",
    sortField: "watched",
    title: "Date Watched",
    sortDirection: "desc",
    active: false,
    type: "number",
    index: 4,
  },
];

export const quickSorts: SavedQuickSorts[] = [
  {
    id: "1",
    name: "🆕 Newly Added",
    index: 0,
    sort: defaultSortSettings.map((sort) => {
      switch (sort.id) {
        case "userrating":
          return { ...sort, active: false, index: 1 };

        case "title":
          return { ...sort, active: false, index: 2 };

        case "releaseDateepoch":
          return { ...sort, active: false, index: 3 };

        case "dateaddedepoch":
          return { ...sort, active: true, index: 0 };

        case "datewatched":
          return { ...sort, active: false, index: 4 };
        default:
          return { ...sort };
      }
    }),
  },
  {
    id: "2",
    name: "👍 User Rating / Date Added",
    index: 1,
    sort: defaultSortSettings.map((sort) => {
      switch (sort.id) {
        case "userrating":
          return { ...sort, active: true, index: 0 };

        case "title":
          return { ...sort, active: false, index: 2 };

        case "releaseDateepoch":
          return { ...sort, active: false, index: 3 };

        case "dateaddedepoch":
          return { ...sort, active: true, index: 1 };

        case "datewatched":
          return { ...sort, active: false, index: 4 };
        default:
          return { ...sort };
      }
    }),
  },
];
