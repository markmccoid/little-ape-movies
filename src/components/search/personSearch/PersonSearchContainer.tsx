import { View, Text, Dimensions, FlatList } from "react-native";
import React from "react";
import { usePersonSearch } from "@/store/query.search";
import MovieImage from "@/components/common/MovieImage";
import { SearchForPerson_Results } from "@markmccoid/tmdb_api";
import { Link } from "expo-router";
import useSettingsStore from "@/store/store.settings";
import PersonSearchItem from "./PersonSearchItem";
// import { useSearchResults } from '@/store/query.search'
const { width, height } = Dimensions.get("window");

const PersonSearchContainer = () => {
  const { persons, isLoading, fetchNextPage } = usePersonSearch();
  const numColumns = useSettingsStore((state) => state.searchColumns);
  const imageWidth = (width - 40) / numColumns;
  const searchColumns = useSettingsStore((state) => state.searchColumns);
  const renderPerson = ({ item: person }: { item: SearchForPerson_Results }) => (
    <PersonSearchItem person={person} imageWidth={imageWidth} />
  );
  return (
    <View className="flex-1">
      <FlatList
        data={persons}
        keyExtractor={(person) => person.id.toString()} // Ensure keys are strings
        onEndReached={() => fetchNextPage()}
        renderItem={renderPerson}
        numColumns={searchColumns}
        key={searchColumns}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </View>
  );
};

export default PersonSearchContainer;
