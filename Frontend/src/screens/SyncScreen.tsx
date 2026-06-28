import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Magnus } from "@/components/magnus/Magnus";
import { Badge, Button, Card, Text } from "@/components/ui";
import { SyncJobRow } from "@/features/gmailSync/components/SyncJobRow";
import {
    useOAuthStatus,
    useSyncHistory,
    useSyncStatus,
    useTriggerSync,
} from "@/features/gmailSync/gmailSync.hooks";
import { colors, radius, spacing } from "@/theme";

// Duración mínima de la animación de sincronización (favorece el efecto).
const MIN_SYNC_MS = 3000;

/** Pestaña de sincronización con Gmail. */
export function SyncScreen() {
  const oauth = useOAuthStatus();
  const status = useSyncStatus();
  const history = useSyncHistory();
  const triggerSync = useTriggerSync();

  // Mantiene a Magnus "dormido" un mínimo de tiempo para lucir la animación.
  const [animating, setAnimating] = useState(false);
  const busy = animating || triggerSync.isPending;

  const connected = oauth.data?.connected;
  const lastJob = status.data;

  const startSync = () => {
    const started = Date.now();
    setAnimating(true);
    triggerSync.mutate(undefined, {
      onSettled: () => {
        const elapsed = Date.now() - started;
        setTimeout(
          () => setAnimating(false),
          Math.max(0, MIN_SYNC_MS - elapsed),
        );
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h2">Sincronización</Text>

        <View style={styles.heroCard}>
          <View style={styles.magnusWrap}>
            <Animated.View
              key={busy ? "sleep" : "happy"}
              entering={FadeIn.duration(450)}
              exiting={FadeOut.duration(300)}
              style={styles.magnusLayer}
            >
              <Magnus size="lg" mood={busy ? "sleep" : "happy"} />
            </Animated.View>
          </View>
          <Text variant="title" color="textOnPrimary" center>
            {busy ? "Buscando tus correos…" : "Magnus está listo"}
          </Text>
          <Text
            variant="caption"
            color="textOnPrimary"
            center
            style={styles.faded}
          >
            {busy
              ? "Leyendo notificaciones de tus bancos"
              : "Trae los gastos más recientes de tu Gmail"}
          </Text>
          <Button
            label="Sincronizar ahora"
            variant="accent"
            fullWidth
            loading={busy}
            icon={
              <Ionicons name="sync" size={20} color={colors.textOnAccent} />
            }
            onPress={startSync}
          />
        </View>

        <Card style={styles.connectionCard}>
          <View style={styles.connRow}>
            <View style={styles.mailIcon}>
              <Ionicons name="mail" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="title">Gmail</Text>
              <Text variant="caption" color="textSecondary" numberOfLines={1}>
                {oauth.data?.email ?? "—"}
              </Text>
            </View>
            <Badge
              label={connected ? "Conectado" : "Desconectado"}
              tone={connected ? "success" : "danger"}
            />
          </View>
        </Card>

        {lastJob ? (
          <View style={styles.section}>
            <Text variant="title">Última sincronización</Text>
            <SyncJobRow job={lastJob} />
          </View>
        ) : null}

        <View style={styles.section}>
          <Text variant="title">Historial</Text>
          {(history.data?.items ?? []).map((job) => (
            <SyncJobRow key={job.id} job={job} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
    paddingTop: spacing.sm,
  },
  heroCard: {
    backgroundColor: colors.brand,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
  },
  magnusWrap: {
    width: 132,
    height: 132,
    alignItems: "center",
    justifyContent: "center",
  },
  magnusLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  faded: { opacity: 0.8 },
  connectionCard: {},
  connRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  mailIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { gap: spacing.sm },
});
