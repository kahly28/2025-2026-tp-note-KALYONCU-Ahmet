import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { ScrollView, View } from "react-native";
import JobList from "@/components/organism/jobLists";

const Favorite = () => {
  const favouriteJobs = useSelector(
    (state: RootState) => state.favourite.value,
  );

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center" }}>
        <JobList jobs={favouriteJobs} />
      </View>
    </ScrollView>
  );
};
export default Favorite;
