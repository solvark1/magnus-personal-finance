import { ReactNode, useEffect, useState } from "react";
import {
    Keyboard,
    LayoutChangeEvent,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";

import { colors, radius, spacing } from "@/theme";

interface Props {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

const OPEN = { duration: 320, easing: Easing.out(Easing.cubic) } as const;
const CLOSE = { duration: 240, easing: Easing.in(Easing.cubic) } as const;
const KB = { duration: 220, easing: Easing.out(Easing.cubic) } as const;

// Arrastre mínimo (px) o velocidad para cerrar deslizando la hoja hacia abajo.
const DRAG_CLOSE_DISTANCE = 110;
const DRAG_CLOSE_VELOCITY = 800;

/**
 * Hoja inferior reutilizable. La hoja sube primero y el fondo oscuro aparece
 * un instante después. Las animaciones se controlan con shared values (no con
 * animaciones de layout) para que el cierre sea limpio, sin el "flash" que
 * provocaba FadeOut al reiniciar la opacidad en web.
 *
 * Extras: sigue el teclado para no tapar los inputs y se puede arrastrar hacia
 * abajo para cerrar.
 */
export function BottomSheet({ visible, onClose, children }: Props) {
  const [mounted, setMounted] = useState(visible);

  // 0 = hoja abajo (cerrada), 1 = hoja arriba (abierta).
  const slide = useSharedValue(0);
  // Opacidad del fondo oscuro.
  const fade = useSharedValue(0);
  // Altura medida de la hoja para deslizarla fuera de pantalla.
  const sheetH = useSharedValue(1200);
  // Desplazamiento por arrastre del usuario (>= 0, hacia abajo).
  const drag = useSharedValue(0);
  // Alto actual del teclado, para subir la hoja por encima.
  const keyboard = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      drag.value = 0;
      slide.value = withTiming(1, OPEN);
      // El fondo entra un poco después de que la hoja empieza a subir.
      fade.value = withDelay(
        120,
        withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) }),
      );
    } else if (mounted) {
      fade.value = withTiming(0, {
        duration: 180,
        easing: Easing.in(Easing.cubic),
      });
      slide.value = withTiming(0, CLOSE, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
    // Solo reacciona al cambio de `visible`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Sigue el teclado para que la hoja no tape los inputs.
  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvt, (e) => {
      keyboard.value = withTiming(e.endCoordinates.height, KB);
    });
    const hide = Keyboard.addListener(hideEvt, () => {
      keyboard.value = withTiming(0, KB);
    });
    return () => {
      show.remove();
      hide.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    Keyboard.dismiss();
    onClose();
  };

  // Arrastrar la hoja hacia abajo la cierra; soltar a medio camino la regresa.
  const pan = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetY(-12)
    .onUpdate((e) => {
      drag.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (
        e.translationY > DRAG_CLOSE_DISTANCE ||
        e.velocityY > DRAG_CLOSE_VELOCITY
      ) {
        runOnJS(close)();
      } else {
        drag.value = withTiming(0, {
          duration: 180,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          (1 - slide.value) * sheetH.value + drag.value - keyboard.value,
      },
    ],
  }));

  const onSheetLayout = (e: LayoutChangeEvent) => {
    sheetH.value = e.nativeEvent.layout.height;
  };

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={close}
    >
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[styles.sheet, sheetStyle]}
            onLayout={onSheetLayout}
          >
            <View style={styles.handle} />
            {children}
            {/* Relleno que extiende el fondo de la hoja hacia abajo: al cerrar
                el teclado cubre el hueco con el color de la hoja (sin salto). */}
            <View style={styles.keyboardFiller} pointerEvents="none" />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  keyboardFiller: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    height: 900,
    backgroundColor: colors.background,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.sm,
  },
});
