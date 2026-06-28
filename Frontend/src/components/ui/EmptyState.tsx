import { StyleSheet, View } from "react-native";

import { Magnus } from "@/components/magnus/Magnus";
import { spacing } from "@/theme";
import { Button } from "./Button";
import { Text } from "./Text";

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  mood?: "happy" | "thinking" | "sleep";
}

/** Estado vacío consistente con la mascota. */
export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  mood = "thinking",
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Magnus size="lg" mood={mood} />
      <View style={styles.text}>
        <Text variant="h3" center>
          {title}
        </Text>
        {message ? (
          <Text variant="body" color="textSecondary" center>
            {message}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} fullWidth />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    paddingVertical: spacing.xxxl,
  },
  text: { gap: spacing.sm, maxWidth: 320 },
  action: { width: "100%", maxWidth: 320 },
});
