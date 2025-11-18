import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

type BubbleState = {
  key: number;
  text: string;
} | null;

type UseFeedbackBubbleOptions = {
  bottomOffset?: number;
};

type UseFeedbackBubbleReturn = {
  showBubble: (message: string) => void;
  bubble: ReactElement | null;
};

export const useFeedbackBubble = (
  options: UseFeedbackBubbleOptions = {},
): UseFeedbackBubbleReturn => {
  const { bottomOffset = 32 } = options;
  const [bubble, setBubble] = useState<BubbleState>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const showBubble = useCallback((message: string) => {
    setBubble({ key: Date.now(), text: message });
  }, []);

  useEffect(() => {
    if (!bubble) {
      return;
    }

    opacity.stopAnimation();
    opacity.setValue(0);

    const animation = Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(1400),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        setBubble(null);
        opacity.setValue(0);
      }
    });

    return () => {
      animation.stop();
    };
  }, [bubble, opacity]);

  const renderedBubble = useMemo(() => {
    if (!bubble) {
      return null;
    }

    const scale = opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0.85, 1],
    });

    return (
      <Animated.View
        key={bubble.key}
        pointerEvents="none"
        style={[
          styles.container,
          {
            bottom: bottomOffset,
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={styles.text}>{bubble.text}</Text>
      </Animated.View>
    );
  }, [bubble, bottomOffset, opacity]);

  return {
    showBubble,
    bubble: renderedBubble,
  };
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "rgba(17, 24, 39, 0.92)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
