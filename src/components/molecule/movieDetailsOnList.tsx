import { Image, View } from "react-native";
import { Movie } from "@/types";
import { Text } from "react-native-paper";

export type MovieDetailsProps = {
  route: {
    params: { movie: Movie };
  };
};

const MovieDetails = ({ route }: MovieDetailsProps) => {
  const movie = route.params.movie;
  return (
    <View style={{ padding: 10 }}>
      <Image
        source={{
          uri:
            `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
            "https://freesvg.org/img/Image-Not-Found.png",
        }}
      />
      <Text variant="displaySmall">{movie.title}</Text>
      <Text variant="headlineSmall">{movie.vote_average}</Text>
      <Text variant="headlineSmall">{movie.original_language}</Text>
      <Text variant="bodyLarge">{movie.overview}</Text>
    </View>
  );
};

export default MovieDetails;
