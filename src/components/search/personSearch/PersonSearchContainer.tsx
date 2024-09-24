import { View, Text, Dimensions, FlatList } from "react-native";
import React from "react";
import { usePersonSearch } from "@/store/query.search";
import MovieImage from "@/components/common/MovieImage";
import { SearchForPerson_Results } from "@markmccoid/tmdb_api";
import { Link } from "expo-router";
// import { useSearchResults } from '@/store/query.search'
const { width, height } = Dimensions.get("window");

const imageWidth = (width - 40) / 3;
const PersonSearchContainer = () => {
  const { persons, isLoading, fetchNextPage } = usePersonSearch();
  const renderPerson = ({ item: person }: { item: SearchForPerson_Results }) => (
    <Link
      href={{
        pathname: `/(auth)/(drawer)/(tabs)/search/personmovies/${person.id}`,
        params: { personName: person.name },
      }}
      className="mb-2 flex-1"
    >
      <View key={person.id} className="flex-1">
        <MovieImage
          posterURL={person.profileImageURL}
          title={person.name}
          imageWidth={imageWidth}
        />
        <View className="mt-[-5] bg-primary rounded-b-lg flex-1 " style={{ width: imageWidth }}>
          <Text
            className="flex-1 px-[5] text-text-inverted font-semibold text-center py-[4]"
            numberOfLines={1}
            lineBreakMode="clip"
          >
            {person.name}
          </Text>
        </View>
      </View>
    </Link>
  );
  return (
    <View className="flex-1">
      <FlatList
        data={persons}
        keyExtractor={(person) => person.id.toString()} // Ensure keys are strings
        onEndReached={() => fetchNextPage()}
        renderItem={renderPerson}
        numColumns={3}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </View>
  );
};

export default PersonSearchContainer;
