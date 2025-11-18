import { useRef, useState } from "react";
import { Animated, Easing, View, Text } from "react-native";
import { Job } from "@/types";
import { Button, Card, Divider } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/App";
import { RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { push, remove } from "@/stores/favouriteSlice";

type JobListProps = {
  jobs: Array<Job>;
};

const JobList = ({ jobs }: JobListProps) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Details">>();

  const favouriteJobs = useSelector(
    (state: RootState) => state.favourite.value,
  );

  const isInFavourite = (id: string): boolean => {
    return favouriteJobs.some((job) => job.id === id);
  };

  const dispatch = useDispatch();
  const [bubbleMessage, setBubbleMessage] = useState("");
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const bubbleScale = bubbleOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const triggerBubble = (message: string) => {
    bubbleOpacity.stopAnimation();
    setBubbleMessage(message);
    bubbleOpacity.setValue(0);

    Animated.sequence([
      Animated.timing(bubbleOpacity, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(1400),
      Animated.timing(bubbleOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setBubbleMessage("");
      }
    });
  };

  const handleAddFavourite = (jobToAdd: Job) => {
    dispatch(push(jobToAdd));
    triggerBubble("Ajouté aux favoris");
  };

  const handleRemoveFavourite = (jobId: string) => {
    dispatch(remove(jobId));
    triggerBubble("Retiré des favoris");
  };

  const dedupedJobs = Array.from(new Set(jobs));

  return (
    <View style={{ position: "relative", paddingBottom: 64 }}>
      {dedupedJobs.map((job) => {
        return (
          <Card
            key={`${job.entreprise}-${job.id}`}
            style={{
              margin: 10,
              borderRadius: 10,
              overflow: "hidden",
              flexDirection: "column",
            }}
            onPress={() =>
              navigation.navigate("Details", {
                job,
              })
            }
          >
            <Card.Cover
              source={{
                uri:
                  job.entreprisePhoto ||
                  "https://freesvg.org/img/Image-Not-Found.png",
              }}
              resizeMode="cover"
            />
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
              {!isInFavourite(job.id) ? (
                <Button onPressOut={() => handleAddFavourite(job)}>
                  Ajouter au favoris
                </Button>
              ) : (
                <Button onPressOut={() => handleRemoveFavourite(job.id)}>
                  Supprimer des favoris
                </Button>
              )}
            </Card.Actions>
          </Card>
        );
      })}
      {bubbleMessage !== "" && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: 24,
            alignSelf: "center",
            backgroundColor: "rgba(17, 24, 39, 0.92)",
            paddingVertical: 8,
            paddingHorizontal: 18,
            borderRadius: 9999,
            opacity: bubbleOpacity,
            transform: [{ scale: bubbleScale }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {bubbleMessage}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export default JobList;
