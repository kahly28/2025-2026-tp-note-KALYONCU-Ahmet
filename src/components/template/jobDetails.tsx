import { useRef, useState } from "react";
import { Animated, Easing, ScrollView, View } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";
//import { type MovieDetailsProps } from "@/components/molecule/movieDetailsOnList";
//import { type Movie } from "@/types";
import { Job } from "@/types";
import { JobDetailsProps } from "../molecule/jobDetailsOnList";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/stores/store";
import { push, remove } from "@/stores/favouriteSlice";

export const JobDetails = ({ route }: JobDetailsProps) => {
  const job: Job = route.params.job;
  const dispatch = useDispatch<AppDispatch>();
  const isFavourite = useSelector((state: RootState) =>
    state.favourite.value.some((item) => item.id === job.id),
  );
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

  const handleToggleFavourite = () => {
    if (isFavourite) {
      dispatch(remove(job.id));
      triggerBubble("Retiré des favoris");
      return;
    }

    dispatch(push(job));
    triggerBubble("Ajouté aux favoris");
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 16 }}
      >
        <Card mode="contained" style={{ borderRadius: 18, overflow: "hidden" }}>
          <Card.Cover
            source={{
              uri:
                job.entreprisePhoto ||
                "https://freesvg.org/img/Image-Not-Found.png",
            }}
            resizeMode="cover"
          />
          <Card.Content style={{ gap: 16 }}>
            <View style={{ gap: 4 }}>
              <Text variant="headlineLarge">{job.poste}</Text>
              <Text variant="titleMedium" style={{ color: "#6b7280" }}>
                {job.entreprise}
              </Text>
              <Text variant="titleSmall" style={{ color: "#6b7280" }}>
                {job.ville}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="labelMedium" style={{ color: "#6b7280" }}>
                  Publié le
                </Text>
                <Text variant="bodyLarge">{job.date}</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="labelMedium" style={{ color: "#6b7280" }}>
                  Salaire annuel
                </Text>
                <Text variant="bodyLarge">
                  {job.salaireAnnuel.toLocaleString("fr-FR")} €
                </Text>
              </View>
            </View>

            <Divider />

            <View style={{ gap: 8 }}>
              <Text variant="titleMedium">Description du poste</Text>
              <Text variant="bodyLarge" style={{ lineHeight: 22 }}>
                {job.description}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions
            style={{ justifyContent: "flex-end", paddingBottom: 16 }}
          >
            <Button
              mode={isFavourite ? "contained" : "outlined"}
              onPress={handleToggleFavourite}
            >
              {isFavourite ? "Retirer des favoris" : "Ajouter aux favoris"}
            </Button>
          </Card.Actions>
        </Card>

        <Card mode="contained" style={{ borderRadius: 18 }}>
          <Card.Content style={{ gap: 12 }}>
            <Text variant="titleMedium">Coordonnées</Text>
            <View style={{ gap: 4 }}>
              <Text variant="labelMedium" style={{ color: "#6b7280" }}>
                Téléphone
              </Text>
              <Text variant="bodyLarge">{job.telephone}</Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text variant="labelMedium" style={{ color: "#6b7280" }}>
                Email
              </Text>
              <Text variant="bodyLarge">{job.email}</Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text variant="labelMedium" style={{ color: "#6b7280" }}>
                Adresse
              </Text>
              <Text variant="bodyLarge">
                {job.numeroRue} {job.rue}
              </Text>
              <Text variant="bodyLarge">
                {job.codePostal ?? ""} {job.ville}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      {bubbleMessage !== "" && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: 32,
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
    </>
  );
};
