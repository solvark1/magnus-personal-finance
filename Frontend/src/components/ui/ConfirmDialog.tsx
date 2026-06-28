import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { colors, radius, spacing } from "@/theme";
import { Button } from "./Button";
import { Text } from "./Text";

export interface ConfirmOptions {
  title: string;
  message?: string;
  /** Texto del botón de confirmación. Por defecto "Aceptar". */
  confirmLabel?: string;
  /** Texto del botón de cancelar. Por defecto "Cancelar". */
  cancelLabel?: string;
  /** Pinta el botón de confirmación en rojo (acciones destructivas). */
  destructive?: boolean;
  /** Oculta el botón de cancelar (estilo aviso de un solo botón). */
  hideCancel?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/** Hook para pedir confirmación con un diálogo propio (en vez de Alert nativo). */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm debe usarse dentro de <ConfirmProvider>");
  }
  return ctx;
}

const OPEN = { duration: 200, easing: Easing.out(Easing.cubic) } as const;
const CLOSE = { duration: 160, easing: Easing.in(Easing.cubic) } as const;

/**
 * Provee un diálogo de confirmación personalizado y consistente con el diseño,
 * reemplazando los Alert del sistema. Devuelve una promesa<boolean>: true si el
 * usuario confirma, false si cancela o cierra.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [mounted, setMounted] = useState(false);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const progress = useSharedValue(0);

  const confirm = useCallback<ConfirmFn>(
    (opts) => {
      setOptions(opts);
      setMounted(true);
      progress.value = withTiming(1, OPEN);
      return new Promise<boolean>((resolve) => {
        resolver.current = resolve;
      });
    },
    [progress],
  );

  const finish = useCallback(
    (result: boolean) => {
      resolver.current?.(result);
      resolver.current = null;
      progress.value = withTiming(0, CLOSE, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    },
    [progress],
  );

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.92 + progress.value * 0.08 }],
  }));

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Modal
        visible={mounted}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => finish(false)}
      >
        <View style={styles.root}>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => finish(false)}
            />
          </Animated.View>

          <Animated.View style={[styles.card, cardStyle]}>
            {options ? (
              <>
                <Text variant="h3" center>
                  {options.title}
                </Text>
                {options.message ? (
                  <Text variant="body" color="textSecondary" center>
                    {options.message}
                  </Text>
                ) : null}

                <View style={styles.actions}>
                  {!options.hideCancel ? (
                    <View style={styles.actionItem}>
                      <Button
                        label={options.cancelLabel ?? "Cancelar"}
                        variant="secondary"
                        fullWidth
                        onPress={() => finish(false)}
                      />
                    </View>
                  ) : null}
                  <View style={styles.actionItem}>
                    <Button
                      label={options.confirmLabel ?? "Aceptar"}
                      variant={options.destructive ? "danger" : "primary"}
                      fullWidth
                      onPress={() => finish(true)}
                    />
                  </View>
                </View>
              </>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
    </ConfirmContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  actionItem: { flex: 1 },
});
