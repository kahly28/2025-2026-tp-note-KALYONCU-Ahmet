import { ComponentProps } from "react";
import { Button, useTheme } from "react-native-paper";
import { Job } from "@/types";
import { useFavouriteManager } from "@/helpers/useFavouriteManager";
import { useFeedbackBubbleContext } from "@/helpers/FeedbackBubbleProvider";

type PaperButtonProps = ComponentProps<typeof Button>;

type FavouriteToggleButtonProps = {
  job: Job;
} & Omit<
  PaperButtonProps,
  "children" | "mode" | "onPress" | "buttonColor" | "textColor"
>;

export const FavouriteToggleButton = ({
  job,
  ...rest
}: FavouriteToggleButtonProps) => {
  const { isFavourite, toggleFavourite } = useFavouriteManager();
  const { showBubble } = useFeedbackBubbleContext();
  const theme = useTheme();

  const jobIsFavourite = isFavourite(job.id);

  const handleToggleFavourite = () => {
    const result = toggleFavourite(job);

    if (result === "added") {
      showBubble("Ajouté aux favoris");
    }

    if (result === "removed") {
      showBubble("Retiré des favoris");
    }
  };

  const buttonColor = jobIsFavourite ? theme.colors.primary : undefined;
  const textColor = jobIsFavourite
    ? theme.colors.onPrimary
    : theme.colors.primary;

  return (
    <Button
      mode={jobIsFavourite ? "contained" : "outlined"}
      buttonColor={buttonColor}
      textColor={textColor}
      onPress={handleToggleFavourite}
      {...rest}
    >
      {jobIsFavourite ? "Retirer des favoris" : "Ajouter aux favoris"}
    </Button>
  );
};
