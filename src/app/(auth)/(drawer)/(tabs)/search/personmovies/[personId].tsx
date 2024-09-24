import React from "react";
import { Stack, useGlobalSearchParams, useNavigation } from "expo-router";
import { usePersonMovieSearch } from "@/store/query.search";
import SearchContainer from "@/components/search/SearchContainer";

/**
 * If a person search is performed, this is the route when a user
 * selects a person to view their movies.
 */
const PersonDetailsRoute = () => {
  const navigation = useNavigation();
  const { personId, personName } = useGlobalSearchParams();
  const { movies } = usePersonMovieSearch(parseInt(personId as string));

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: personName,
    });
  }, [navigation]);

  return (
    <>
      <SearchContainer movies={movies} fetchNextPage={undefined} />
    </>
  );
};

export default PersonDetailsRoute;
