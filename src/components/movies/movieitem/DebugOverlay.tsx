import { View, Text } from "react-native";
import React from "react";
import useMovieStore, { ShowItemType } from "@/store/store.shows";
import dayjs from "dayjs";

type Props = {
  movie: ShowItemType;
  width: number;
};
const DebugOverlay = ({ movie, width }: Props) => {
  const tagsArray = useMovieStore((state) => state.tagArray);
  const tags = tagsArray.filter((tag) => movie.tags.includes(tag.id)).map((el) => el.name);

  return (
    <View
      className="absolute top-0 left-0 z-10 p-[2] bg-card rounded-t-lg opacity-85"
      style={{ width }}
    >
      <Text className="font-semibold self-center">{movie.title}</Text>
      <View className="flex-row justify-between border-b border-t bg-teal-100 px-2 ">
        <Text className="text-sm font-semibold">Date Added:</Text>
        <Text className="text-sm font-semibold">
          {dayjs.unix(movie.dateAddedEpoch || 0).format("MM-DD-YYYY")}
        </Text>
      </View>
      <View className="flex-row justify-between px-2">
        <Text className="text-sm">Date Watched:</Text>
        <Text className="text-sm">
          {movie.watched ? dayjs.unix(movie.watched || 0).format("MM-DD-YYYY") : "N/A"}
        </Text>
      </View>
      <View className="flex-row justify-between border-b border-t px-2 bg-teal-100">
        <Text className="text-sm font-semibold">Date Released:</Text>
        <Text className="text-sm font-semibold">
          {dayjs.unix(movie.releaseDateEpoch || 0).format("MM-DD-YYYY")}
        </Text>
      </View>
      <View className="flex-row justify-between px-2">
        <Text className="text-sm">Favorited:</Text>
        <Text className="text-sm">
          {movie.favorited ? dayjs.unix(movie.favorited || 0).format("MM-DD-YYYY") : "N/A"}
        </Text>
      </View>
      <View className="flex-row justify-between border-b border-t px-2 bg-teal-100">
        <Text className="text-sm font-semibold">User Rating:</Text>
        <Text className="text-sm font-semibold">{movie.rating ? movie.rating : "N/A"}</Text>
      </View>
      <View className="flex-row justify-between px-2">
        <Text className="text-sm ">
          <Text className="text-sm font-semibold">Tags: </Text>
          {tags.join(", ")}
        </Text>
      </View>
    </View>
  );
};

export default DebugOverlay;
