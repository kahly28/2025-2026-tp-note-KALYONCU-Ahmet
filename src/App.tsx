import {
  StaticParamList,
  createStaticNavigation,
} from "@react-navigation/native";

import { Provider as StoreProvider } from "react-redux";
import Jobs from "@/components/pages/jobs";
import { createStackNavigator } from "@react-navigation/stack";
import { store } from "@/stores/store";
import Favorite from "@/components/pages/favorites";
import { JobDetails } from "@/components/template/jobDetails";

const Stack = createStackNavigator({
  screens: {
    Liste: Jobs,
    Details: JobDetails,
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
