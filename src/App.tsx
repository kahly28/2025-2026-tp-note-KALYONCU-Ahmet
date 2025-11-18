import {
  StaticParamList,
  createStaticNavigation,
} from "@react-navigation/native";

import { Provider as StoreProvider } from "react-redux";
import Movies from "@/components/pages/movies";
import { createStackNavigator } from "@react-navigation/stack";
import { MovieDetails } from "@/components/template/movieDetails";
import { store } from "@/stores/store";
import Favorite from "@/components/pages/favorites";

const Stack = createStackNavigator({
  screens: {
    Liste: Movies,
    Details: MovieDetails,
    Favorites: Favorite,
  },
});
const Navigation = createStaticNavigation(Stack);
export type RootStackParamList = StaticParamList<typeof Stack>;

export default function App() {
  return (
    <StoreProvider store={store}>
      <Navigation />
    </StoreProvider>
  );
}
