import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Wordmark } from "@/components/magnus/Wordmark";
import { useAuth } from "@/features/auth/AuthContext";
import { colors, radius, spacing } from "@/theme";

/**
 * Barra superior persistente: marca a la izquierda y acceso al perfil del
 * usuario a la derecha. Mismo lenguaje visual que la barra inferior.
 */
export function TopBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <View
      style={[styles.bar, { paddingTop: insets.top, height: 60 + insets.top }]}
    >
      <View style={styles.inner}>
        <Wordmark height={32} />
        <Pressable
          onPress={() => router.push("/profile")}
          hitSlop={8}
          style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
        >
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatarImg} />
          ) : (
            <Ionicons name="person" size={22} color={colors.primary} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  inner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  pressed: { opacity: 0.7 },
});
