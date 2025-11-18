import { Linking, Platform, ScrollView, View } from "react-native";
import { Card, Divider, Text } from "react-native-paper";
//import { type MovieDetailsProps } from "@/components/molecule/movieDetailsOnList";
//import { type Movie } from "@/types";
import { Job } from "@/types";
import { JobDetailsProps } from "../molecule/jobDetailsOnList";
import { useFeedbackBubbleContext } from "@/helpers/FeedbackBubbleProvider";
import { FavouriteToggleButton } from "@/components/molecule/FavouriteToggleButton";

export const JobDetails = ({ route }: JobDetailsProps) => {
  const job: Job = route.params.job;
  const { showBubble } = useFeedbackBubbleContext();

  const debugLog = (message: string, payload?: unknown) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`[JobDetails] ${message}`, payload);
    }
  };

  const openLink = async (url: string): Promise<boolean> => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      debugLog(`canOpenURL(${url})`, canOpen);
      if (!canOpen) {
        return false;
      }

      debugLog("Opening URL", url);
      await Linking.openURL(url);
      return true;
    } catch (error) {
      debugLog(`openURL threw for ${url}`, error);
      return false;
    }
  };

  const openWithFallback = async (
    urls: Array<string>,
    fallbackMessage: string,
  ) => {
    debugLog("Attempting URLs", urls);
    for (const url of urls) {
      if (await openLink(url)) {
        debugLog("URL succeeded", url);
        return;
      }
      debugLog("URL failed", url);
    }

    debugLog("All URL attempts failed", fallbackMessage);
    showBubble(fallbackMessage);
  };

  const handlePhonePress = () => {
    const sanitizedPhone = job.telephone.replace(/[^\d+]/g, "");
    debugLog("Sanitized phone", sanitizedPhone);
    if (sanitizedPhone.length === 0) {
      showBubble("Numéro indisponible");
      return;
    }

    const phoneUrls =
      Platform.OS === "ios"
        ? [`telprompt:${sanitizedPhone}`, `tel:${sanitizedPhone}`]
        : [`tel:${sanitizedPhone}`];

    void openWithFallback(phoneUrls, "Impossible d'ouvrir l'app téléphone");
  };

  const handleEmailPress = () => {
    debugLog("handleEmailPress", job.email);
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

    debugLog("handleAddressPress parts", parts);

    if (parts.length === 0) {
      showBubble("Adresse indisponible");
      return;
    }

    const encodedAddress = encodeURIComponent(parts.join(" "));
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    debugLog("handleAddressPress URL", mapsUrl);

    void openWithFallback(
      [mapsUrl],
      "Impossible d'ouvrir l'app de cartographie",
    );
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
            <FavouriteToggleButton job={job} />
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
