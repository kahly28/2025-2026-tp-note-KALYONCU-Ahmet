import { Image, View } from "react-native";
import { Job } from "@/types";
import { Text } from "react-native-paper";

export type JobDetailsProps = {
  route: {
    params: { job: Job };
  };
};

const JobDetails = ({ route }: JobDetailsProps) => {
  const job = route.params.job;
  return (
    <View style={{ padding: 10 }}>
      <Image
        source={{
          uri:
            job.entreprisePhoto ||
            "https://freesvg.org/img/Image-Not-Found.png",
        }}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignSelf: "center",
          marginBottom: 16,
        }}
      />
      <Text variant="displaySmall">{job.poste}</Text>
      <Text variant="headlineSmall">{job.entreprise}</Text>
      <Text variant="bodyLarge" style={{ marginTop: 12 }}>
        {job.description}
      </Text>
    </View>
  );
};

export default JobDetails;
