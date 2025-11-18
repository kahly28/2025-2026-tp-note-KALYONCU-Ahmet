import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { ScrollView, View } from "react-native";
import MovieList from "@/components/organism/movieList";

const Favorite = () => {
  const favouriteMovies = useSelector(
    (state: RootState) => state.favourite.value,
  );

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center" }}>
        <MovieList movies={favouriteMovies} />
      </View>
    </ScrollView>
  );
};
export default Favorite;
