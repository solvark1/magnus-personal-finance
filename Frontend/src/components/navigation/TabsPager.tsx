import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TopBar } from "@/components/layout/TopBar";
import { Text } from "@/components/ui";
import { ChartsScreen } from "@/screens/ChartsScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { SendersScreen } from "@/screens/SendersScreen";
import { SyncScreen } from "@/screens/SyncScreen";
import { colors, fontFamily } from "@/theme";

const SCREENS = [HomeScreen, ChartsScreen, SendersScreen, SyncScreen];
const COUNT = SCREENS.length;
const SPRING = { duration: 300, easing: Easing.out(Easing.cubic) } as const;

type TabItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
};

const TABS: TabItem[] = [
  { label: "Gastos", icon: "wallet", iconOutline: "wallet-outline" },
  { label: "Gráficas", icon: "bar-chart", iconOutline: "bar-chart-outline" },
  { label: "Remitentes", icon: "mail", iconOutline: "mail-outline" },
  {
    label: "Sincronizar",
    icon: "sync",
    iconOutline: "sync-outline",
  },
];

/**
 * Carrusel horizontal tipo Instagram: las cuatro pantallas viven una al lado
 * de la otra y el dedo arrastra el contenido de forma continua. Al soltar,
 * el panel se acomoda a la página más cercana según distancia o velocidad.
 */
export function TabsPager() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const indexSV = useSharedValue(0);
  // Estado para resaltar la pestaña activa en la barra inferior.
  const [active, setActiveState] = useState(0);

  const setActive = (i: number) => {
    setActiveState(i);
  };

  // Bandera de "arrastre en curso": cuando el gesto Pan se activa de verdad,
  // bloqueamos el clic/press del elemento que el usuario tocó para deslizar
  // (botón, fila de movimiento…) para que solo cambie de pantalla.
  const draggingRef = useRef(false);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginDrag = () => {
    if (clearTimer.current) {
      clearTimeout(clearTimer.current);
      clearTimer.current = null;
    }
    draggingRef.current = true;
  };

  const endDrag = () => {
    // Mantén la bandera un instante para alcanzar a suprimir el clic sintético
    // que el navegador dispara justo después de soltar.
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => {
      draggingRef.current = false;
      clearTimer.current = null;
    }, 80);
  };

  // En web, intercepta el clic en fase de captura: si venimos de un arrastre,
  // lo cancela antes de que llegue al botón/fila tocados.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const onClickCapture = (e: Event) => {
      if (draggingRef.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    document.addEventListener("click", onClickCapture, true);
    return () => {
      document.removeEventListener("click", onClickCapture, true);
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  // Reposiciona el carrusel solo cuando cambia el ancho (p. ej. al
  // redimensionar la ventana). No depende de `active` para no interferir con
  // la animación del gesto en curso.
  useEffect(() => {
    translateX.value = -indexSV.value * width;
  }, [width, translateX, indexSV]);

  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(COUNT - 1, i));
    indexSV.value = target;
    translateX.value = withTiming(-target * width, SPRING);
    setActive(target);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .failOffsetY([-14, 14])
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onStart(() => {
      // El gesto se activó (pasó el umbral horizontal) → es un arrastre real.
      runOnJS(beginDrag)();
    })
    .onUpdate((e) => {
      let x = startX.value + e.translationX;
      const min = -(COUNT - 1) * width;
      // Resistencia (rubber-band) en los extremos.
      if (x > 0) x = x * 0.25;
      else if (x < min) x = min + (x - min) * 0.25;
      translateX.value = x;
    })
    .onEnd((e) => {
      const cur = indexSV.value;
      let target = cur;
      if (e.translationX < -width * 0.2 || e.velocityX < -500) target = cur + 1;
      else if (e.translationX > width * 0.2 || e.velocityX > 500)
        target = cur - 1;
      target = Math.max(0, Math.min(COUNT - 1, target));
      indexSV.value = target;
      translateX.value = withTiming(-target * width, SPRING);
      runOnJS(setActive)(target);
    })
    .onFinalize(() => {
      runOnJS(endDrag)();
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.root}>
      <TopBar />

      <View style={styles.viewport}>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[styles.row, { width: width * COUNT }, rowStyle]}
          >
            {SCREENS.map((Screen, i) => (
              <View key={i} style={{ width }}>
                <Screen />
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
      </View>

      <View
        style={[
          styles.tabBar,
          {
            height: 58 + insets.bottom,
            paddingBottom: insets.bottom + 8,
          },
        ]}
      >
        {TABS.map((tab, i) => {
          const focused = active === i;
          const color = focused ? colors.brand : colors.textMuted;
          return (
            <Pressable
              key={tab.label}
              style={styles.tabItem}
              onPress={() => goTo(i)}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
            >
              <Ionicons
                name={focused ? tab.icon : tab.iconOutline}
                size={24}
                color={color}
              />
              <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  viewport: { flex: 1, overflow: "hidden" },
  row: { flex: 1, flexDirection: "row" },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  tabLabel: { fontFamily: fontFamily.bold, fontSize: 10 },
});
