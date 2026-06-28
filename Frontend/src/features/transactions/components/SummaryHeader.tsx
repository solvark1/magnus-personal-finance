import { Image, StyleSheet, View } from "react-native";

import { magnusProfile } from "@/components/magnus/magnusImages";
import { Text } from "@/components/ui";
import { radius, spacing } from "@/theme";

interface Props {
  userName: string;
}

/** Saludo del encabezado con el retrato de Magnus a la par. */
export function SummaryHeader({ userName }: Props) {
  return (
    <View style={styles.greetingRow}>
      <View style={{ flex: 1 }}>
        <Text variant="body" color="textSecondary">
          Hola,
        </Text>
        <Text variant="h2">{userName}</Text>
      </View>
      <Image source={magnusProfile} style={styles.avatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.sm,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
  },
});
