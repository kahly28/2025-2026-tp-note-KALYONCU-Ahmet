import { View, Text } from "react-native";
import { Job } from "@/types";
import { Button, Card, Divider } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/App";
import { useFavouriteManager } from "@/helpers/useFavouriteManager";
import { useFeedbackBubbleContext } from "@/helpers/FeedbackBubbleProvider";

type JobListProps = {
  jobs: Array<Job>;
};

const JobList = ({ jobs }: JobListProps) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Details">>();

  const { isFavourite, addFavourite, removeFavourite } = useFavouriteManager();
  const { showBubble } = useFeedbackBubbleContext();
  const dedupedJobs = Array.from(new Set(jobs));

  return (
    <View style={{ paddingBottom: 64 }}>
      {dedupedJobs.map((job) => {
        const jobIsFavourite = isFavourite(job.id);

        const handleToggleFavourite = () => {
          const result = jobIsFavourite
            ? removeFavourite(job.id)
            : addFavourite(job);

          if (result === "added") {
            showBubble("Ajouté aux favoris");
          }

          if (result === "removed") {
            showBubble("Retiré des favoris");
          }
        };

        return (
          <Card
            key={`${job.entreprise}-${job.id}`}
            style={{
              margin: 10,
              borderRadius: 10,
              flexDirection: "column",
            }}
            onPress={() =>
              navigation.navigate("Details", {
                job,
              })
            }
          >
            <View
              style={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                overflow: "hidden",
              }}
            >
              <Card.Cover
                source={{
                  uri:
                    job.entreprisePhoto ||
                    "https://freesvg.org/img/Image-Not-Found.png",
                }}
                resizeMode="cover"
              />
            </View>
            <Card.Content style={{ gap: 12 }}>
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  {job.poste}
                </Text>
                <Text style={{ color: "#6b7280" }}>
                  {job.entreprise} • {job.ville}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: "#6b7280", fontSize: 12 }}>
                    Publié le
                  </Text>
                  <Text style={{ fontSize: 14 }}>{job.date}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: "#6b7280", fontSize: 12 }}>
                    Salaire annuel
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    {job.salaireAnnuel.toLocaleString("fr-FR")} €
                  </Text>
                </View>
              </View>

              <Divider />

              <Text
                numberOfLines={3}
                style={{ fontSize: 14, color: "#374151" }}
              >
                {job.description}
              </Text>
            </Card.Content>

            <Card.Actions style={{ justifyContent: "flex-end", padding: 12 }}>
              <Button
                mode={jobIsFavourite ? "contained" : "outlined"}
                onPress={handleToggleFavourite}
              >
                {jobIsFavourite ? "Retirer des favoris" : "Ajouter aux favoris"}
              </Button>

              {/*
              {!isFavourite(job.id) ? (
                <Button
                  onPressOut={() => {
                    const result = addFavourite(job);

                    if (result === "added") {
                      showBubble("Ajouté aux favoris");
                    }
                  }}
                >
                  Ajouter au favoris
                </Button>
              ) : (
                <Button
                  onPressOut={() => {
                    const result = removeFavourite(job.id);

                    if (result === "removed") {
                      showBubble("Retiré des favoris");
                    }
                  }}
                >
                  Supprimer des favoris
                </Button>
              )}
              */}
            </Card.Actions>
          </Card>
        );
      })}
    </View>
  );
};

export default JobList;
