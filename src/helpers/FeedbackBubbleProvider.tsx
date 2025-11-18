import { ReactNode, createContext, useContext } from "react";
import { useFeedbackBubble } from "./useFeedbackBubble";

type FeedbackBubbleContextValue = {
  showBubble: (message: string) => void;
};

type FeedbackBubbleProviderProps = {
  children: ReactNode;
  bottomOffset?: number;
};

const FeedbackBubbleContext = createContext<FeedbackBubbleContextValue | null>(
  null,
);

export const FeedbackBubbleProvider = ({
  children,
  bottomOffset,
}: FeedbackBubbleProviderProps) => {
  const { showBubble, bubble } = useFeedbackBubble({ bottomOffset });

  return (
    <FeedbackBubbleContext.Provider value={{ showBubble }}>
      {children}
      {bubble}
    </FeedbackBubbleContext.Provider>
  );
};

export const useFeedbackBubbleContext = (): FeedbackBubbleContextValue => {
  const context = useContext(FeedbackBubbleContext);
  if (!context) {
    throw new Error(
      "useFeedbackBubbleContext must be used within a FeedbackBubbleProvider",
    );
  }

  return context;
};
