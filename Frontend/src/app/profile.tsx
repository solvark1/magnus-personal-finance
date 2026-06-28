import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card, Text } from "@/components/ui";
import { useAuth } from "@/features/auth/AuthContext";
import { formatDate } from "@/lib/format";
import { colors, radius, spacing } from "@/theme";

/** Pantalla de perfil: datos del usuario y cierre de sesión. */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text variant="title">Perfil</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.avatar}>
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                style={styles.avatarImg}
              />
            ) : (
              <Ionicons name="person" size={52} color={colors.primary} />
            )}
          </View>
          <Text variant="h2" center>
            {user?.display_name ?? "—"}
          </Text>
          <Text variant="body" color="textSecondary" center>
            {user?.email ?? "—"}
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <InfoRow
            icon="globe-outline"
            label="Idioma"
            value={user?.locale ?? "—"}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="calendar-outline"
            label="Miembro desde"
            value={user?.created_at ? formatDate(user.created_at) : "—"}
          />
          {user?.last_login_at ? (
            <>
              <View style={styles.divider} />
              <InfoRow
                icon="time-outline"
                label="Último ingreso"
                value={formatDate(user.last_login_at)}
              />
            </>
          ) : null}
        </Card>

        <Button
          label="Cerrar sesión"
          variant="danger"
          fullWidth
          icon={
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.textOnPrimary}
            />
          }
          onPress={handleSignOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text variant="body" color="textSecondary" style={{ flex: 1 }}>
        {label}
      </Text>
      <Text variant="bodyMedium" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.6 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  hero: { alignItems: "center", gap: spacing.sm, marginTop: spacing.lg },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  avatarImg: { width: "100%", height: "100%" },
  infoCard: { gap: spacing.md },
  infoRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, backgroundColor: colors.border },
});
