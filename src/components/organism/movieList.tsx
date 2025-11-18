import { View, Text } from "react-native";
import { Movie } from "@/types";
import { Button, Card } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/App";
import { RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { push, remove } from "@/stores/favouriteSlice";

type MovieListProps = {
  movies: Array<Movie>;
};

const MovieList = ({ movies }: MovieListProps) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Details">>();

  const favouriteMovies = useSelector(
    (state: RootState) => state.favourite.value,
  );

  const isInFavourite = (id: number): boolean => {
    return favouriteMovies.some((movie) => movie.id === id);
  };

  const dispatch = useDispatch();

  movies = Array.from(new Set(movies));

  return (
    <View>
      {movies.map((movie) => {
        return (
          <Card
            key={movie.original_title + movie.id}
            style={{
              margin: 10,
              borderRadius: 10,
              padding: 20,
              flexDirection: "column",
            }}
            onPress={() =>
              navigation.navigate("Details", {
                movie: movie,
              })
            }
          >
            <Card.Title
              title={movie.original_title}
              subtitle={movie.release_date}
            />
            <Card.Cover
              source={{
                uri:
                  `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
                  "https://freesvg.org/img/Image-Not-Found.png",
              }}
            />
            <Card.Content>
              <Text style={{ fontStyle: "italic" }}>
                {movie.vote_average} / 10
              </Text>
              <Text>{movie.overview}</Text>
            </Card.Content>

            <Card.Actions>
              {!isInFavourite(movie.id) ? (
                <Button onPressOut={() => dispatch(push(movie))}>
                  Ajouter au favoris
                </Button>
              ) : (
                <Button onPressOut={() => dispatch(remove(movie.id))}>
                  Supprimer des favoris
                </Button>
              )}
            </Card.Actions>
          </Card>
        );
      })}
    </View>
  );
};

export default MovieList;
