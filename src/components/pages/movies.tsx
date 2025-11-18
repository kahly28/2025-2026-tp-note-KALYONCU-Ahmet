import { ScrollView, View } from "react-native";
import movies1 from "@/helpers/PopularMovies_p1.json" with { type: "json" };
import movies2 from "@/helpers/PopularMovies_p2.json" with { type: "json" };

import { useEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Movie, Page } from "@/types";
import { RootStackParamList } from "@/App";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import MovieList from "@/components/organism/movieList";

const Movies = () => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Details">>();

  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getPopularMovies(movies1);
    getPopularMovies(movies2);
    return () => {};
  }, []);

  const getPopularMovies = (page: Page) => {
    setMovies((prevMovies) => [...prevMovies, ...page.results]);
  };

  const favouriteMovies = useSelector(
    (state: RootState) => state.favourite.value,
  );

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Button
          mode="elevated"
          style={{ maxWidth: 200, margin: 20 }}
          onPressOut={() => navigation.navigate("Favorites")}
        >
          Favoris ({favouriteMovies.length})
        </Button>
        <MovieList movies={movies} />
      </View>
    </ScrollView>
  );
};

export default Movies;
