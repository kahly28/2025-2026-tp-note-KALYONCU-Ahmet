import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Searchbar, Text } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import jobsData from "@/helpers/jobs.json" with { type: "json" };
import JobList from "@/components/organism/jobLists";
import { RootState } from "@/stores/store";
import { RootStackParamList } from "@/App";
import { Job } from "@/types";

const Jobs = () => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Details">>();
  const [jobs, setJobs] = useState<Array<Job>>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setJobs(jobsData as Array<Job>);
  }, []);

  const favouriteJobs = useSelector(
    (state: RootState) => state.favourite.value,
  );

  const filteredJobs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return jobs;
    }

    return jobs.filter((job) =>
      job.poste.toLowerCase().includes(normalizedQuery),
    );
  }, [jobs, searchQuery]);

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text variant="titleLarge" style={{ marginTop: 16 }}>
          {filteredJobs.length} offres disponibles
        </Text>
        <Button
          mode="elevated"
          style={{ maxWidth: 200, margin: 20 }}
          onPressOut={() => navigation.navigate("Favorites")}
        >
          Favoris ({favouriteJobs.length})
        </Button>
        <Searchbar
          placeholder="Rechercher un poste"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ width: "90%", marginBottom: 16 }}
          inputStyle={{ minHeight: 0 }}
        />
        {filteredJobs.length === 0 ? (
          <Text style={{ marginTop: 32 }}>Aucune offre ne correspond.</Text>
        ) : (
          <JobList jobs={filteredJobs} />
        )}
      </View>
    </ScrollView>
  );
};

export default Jobs;
