import React from "react";
import {
  Stack,
  useGlobalSearchParams,
  useNavigation,
  type NativeStackNavigationOptions,
} from "expo-router";
import { usePersonMovieSearch } from "@/store/query.search";
import SearchContainer from "@/components/search/SearchContainer";
import FetchNotice from "@/components/common/FetchNotice";
/**
 * If a person search is performed, this is the route when a user
 * selects a person to view their movies.
 */
const PersonDetailsRoute = () => {
  const navigation = useNavigation();
  const { personId, personName } = useGlobalSearchParams();
  const { movies, isLoading, isError } = usePersonMovieSearch(parseInt(personId as string));

  React.useLayoutEffect(() => {
    const options: NativeStackNavigationOptions = {
      title: personName as string,
      headerBackTitle: "Back",
    };
    navigation.setOptions(options);
  }, [navigation]);

  if (isError && movies.length === 0 && !isLoading) {
    return <FetchNotice message="Couldn't load this person's movies." />;
  }

  return (
    <>
      <SearchContainer movies={movies} fetchNextPage={undefined} />
    </>
  );
};

export default PersonDetailsRoute;
