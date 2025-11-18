import { Platform, ScrollView, View, Linking } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";
import { Job } from "@/types";
import { JobDetailsProps } from "../molecule/jobDetailsOnList";
import { useFeedbackBubbleContext } from "@/helpers/FeedbackBubbleProvider";
import { useFavouriteManager } from "@/helpers/useFavouriteManager";

export const JobDetails = ({ route }: JobDetailsProps) => {
  const job: Job = route.params.job;
  const { isFavourite, toggleFavourite } = useFavouriteManager();
  const jobIsFavourite = isFavourite(job.id);
  const { showBubble } = useFeedbackBubbleContext();

  const openLink = async (url: string): Promise<boolean> => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        return false;
      }

      await Linking.openURL(url);
      return true;
    } catch {
      return false;
    }
  };

  const openWithFallback = async (
    urls: Array<string>,
    fallbackMessage: string,
  ) => {
    for (const url of urls) {
      if (await openLink(url)) {
        return;
      }
    }

    showBubble(fallbackMessage);
  };

  const handlePhonePress = () => {
    const sanitizedPhone = job.telephone.replace(/[^\d+]/g, "");
    if (sanitizedPhone.length === 0) {
      showBubble("Numéro indisponible");
      return;
    }

    let phoneUrls: Array<string>;

    if (Platform.OS === "ios") {
      phoneUrls = [`tel:${sanitizedPhone}`];
    } else {
      phoneUrls = [`tel:${sanitizedPhone}`];
    }

    void openWithFallback(phoneUrls, "Impossible d'ouvrir l'app téléphone");
  };

  const handleEmailPress = () => {
    if (!job.email) {
      showBubble("Email indisponible");
      return;
    }

    void openWithFallback(
      [`mailto:${job.email}`],
      "Impossible d'ouvrir l'app mail",
    );
  };

  const handleAddressPress = () => {
    const parts = [job.numeroRue, job.rue, job.codePostal ?? "", job.ville]
      .map((part) => part?.trim())
      .filter((part): part is string => Boolean(part && part.length > 0));

    if (parts.length === 0) {
      showBubble("Adresse indisponible");
      return;
    }

    const encodedAddress = encodeURIComponent(parts.join(" "));
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    void openWithFallback(
      [mapsUrl],
      "Impossible d'ouvrir l'app de cartographie",
    );
  };

  const handleToggleFavourite = () => {
    const result = toggleFavourite(job);

    if (result === "added") {
      showBubble("Ajouté aux favoris");
    }

    if (result === "removed") {
      showBubble("Retiré des favoris");
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 16 }}
      >
        <Card mode="contained" style={{ borderRadius: 18 }}>
          <View
            style={{
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
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
              mode={jobIsFavourite ? "contained" : "outlined"}
              onPress={handleToggleFavourite}
            >
              {jobIsFavourite ? "Retirer des favoris" : "Ajouter aux favoris"}
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
              <Text
                variant="bodyLarge"
                style={{ color: "#2563eb", textDecorationLine: "underline" }}
                onPress={handlePhonePress}
              >
                {job.telephone}
              </Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text variant="labelMedium" style={{ color: "#6b7280" }}>
                Email
              </Text>
              <Text
                variant="bodyLarge"
                style={{ color: "#2563eb", textDecorationLine: "underline" }}
                onPress={handleEmailPress}
              >
                {job.email}
              </Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text variant="labelMedium" style={{ color: "#6b7280" }}>
                Adresse
              </Text>
              <Text
                variant="bodyLarge"
                style={{ color: "#2563eb", textDecorationLine: "underline" }}
                onPress={handleAddressPress}
              >
                {job.numeroRue} {job.rue}
              </Text>
              <Text
                variant="bodyLarge"
                style={{ color: "#2563eb", textDecorationLine: "underline" }}
                onPress={handleAddressPress}
              >
                {job.codePostal ?? ""} {job.ville}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};
