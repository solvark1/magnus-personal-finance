import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Magnus } from "@/components/magnus/Magnus";
import { Wordmark } from "@/components/magnus/Wordmark";
import { Button, Screen, Text, useConfirm } from "@/components/ui";
import { useAuth } from "@/features/auth/AuthContext";
import { colors, radius, spacing } from "@/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      await signIn();
    } catch {
      await confirm({
        title: "Ups",
        message:
          "No pudimos iniciar sesión. Revisa el mock server e inténtalo de nuevo.",
        confirmLabel: "Entendido",
        hideCancel: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.hero}>
        <Animated.View entering={FadeIn.duration(500)}>
          <Magnus size="xl" mood="happy" />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(150)}
          style={styles.titleBlock}
        >
          <Wordmark height={32} />
          <Text variant="body" color="textSecondary" center style={styles.tag}>
            Tus gastos diarios, ordenados automáticamente.
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInUp.duration(500).delay(300)}
        style={styles.actions}
      >
        <Button
          label="Continuar con Google"
          variant="brand"
          fullWidth
          loading={loading}
          onPress={handleLogin}
          icon={
            <View style={styles.googleBadge}>
              <Text variant="label" color="brand">
                G
              </Text>
            </View>
          }
        />
        <Text variant="caption" color="textMuted" center>
          Solo lectura · Nunca enviamos ni modificamos tus correos
        </Text>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: spacing.xxxl,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },
  titleBlock: { gap: spacing.sm, alignItems: "center" },
  tag: { maxWidth: 280 },
  actions: { gap: spacing.lg },
  googleBadge: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
