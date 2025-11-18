import { View, Image } from "react-native";
import { Text } from "react-native-paper";
import { type MovieDetailsProps } from "@/components/molecule/movieDetailsOnList";
import { type Movie } from "@/types";

export const MovieDetails = ({ route }: MovieDetailsProps) => {
  const movie: Movie = route.params.movie;

  return (
    <View style={{ display: "flex", margin: 20, gap: "10px" }}>
      <Text variant="titleLarge">{movie.title}</Text>
      <Text variant="labelMedium">
        {movie.original_language}: ({movie.original_title})
      </Text>
      <Text>{movie.release_date}</Text>
      <Image
        style={{ height: "50%" }}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }}
        resizeMode="contain"
      />
      <Text>Popularity: {movie.popularity}</Text>
      <Text variant="labelLarge">
        {movie.vote_average} / 10 with {movie.vote_count} votes
      </Text>
      <Text>{movie.overview}</Text>
    </View>
  );
};
