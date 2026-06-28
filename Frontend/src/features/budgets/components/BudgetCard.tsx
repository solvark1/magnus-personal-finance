import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

import { Magnus } from "@/components/magnus/Magnus";
import { Text } from "@/components/ui";
import { formatCurrency } from "@/lib/format";
import { colors, radius, shadows, spacing } from "@/theme";
import type { Budget, TransactionSummary } from "@/types/models";

import { budgetTip, monthName } from "../budgetTip";

interface Props {
  budget: Budget;
  summary?: TransactionSummary;
  onEdit: () => void;
}

// Serie decorativa (0–100) para la gráfica de líneas de fondo.
const SERIES = [26, 40, 33, 54, 46, 68, 58, 76, 64, 86, 72, 92];

// Ancho del haz de brillo que recorre la tarjeta.
const SHINE_W = 88;

/**
 * Tarjeta de presupuesto del mes: progreso gastado vs. presupuesto, métricas
 * clave (porcentaje consumido, restante, días) y un consejo de Magnus.
 * Mismo lenguaje visual que la tarjeta hero (azul profundo).
 */
export function BudgetCard({ budget, summary, onEdit }: Props) {
  const hasBudget = budget.amount > 0;
  // Los ingresos extra del mes se suman al presupuesto disponible.
  const available = budget.amount + (budget.income ?? 0);
  const ratio = hasBudget ? budget.spent / available : 0;
  const pct = Math.max(0, Math.round(ratio * 100));
  const remaining = available - budget.spent;

  const topCategory = summary?.by_category?.[0];
  const movements = summary?.transaction_count ?? 0;

  // Dorado por defecto; rojo solo si se pasó del presupuesto.
  const progressColor = ratio >= 1 ? colors.danger : colors.accent;

  const tip = budgetTip(
    budget.spent,
    available,
    budget.days_left,
    budget.currency,
  );

  // Brillo diagonal que recorre la tarjeta de izquierda a derecha cada ~5s.
  const cardW = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.cubic) }),
        withDelay(4000, withTiming(0, { duration: 0 })),
      ),
      -1,
    );
    return () => cancelAnimation(shimmer);
  }, [shimmer]);

  const shineStyle = useAnimatedStyle(() => {
    const w = cardW.value || 320;
    const travel = w + SHINE_W * 2;
    return {
      transform: [
        { translateX: -SHINE_W + shimmer.value * travel },
        { skewX: "-18deg" },
      ],
    };
  });

  return (
    <Pressable
      onPress={onEdit}
      onLayout={(e: LayoutChangeEvent) => {
        cardW.value = e.nativeEvent.layout.width;
      }}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Gráfica de líneas decorativa, opacada, de fondo. */}
      <DecorLineChart />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color="textOnPrimary" style={styles.faded}>
              Presupuesto de {monthName(budget.month)}
            </Text>
            {hasBudget ? (
              <Text variant="title" color="textOnPrimary">
                {formatCurrency(budget.spent, budget.currency)}
                <Text variant="body" color="textOnPrimary" style={styles.faded}>
                  {"  de "}
                  {formatCurrency(available, budget.currency)}
                </Text>
              </Text>
            ) : (
              <Text variant="title" color="textOnPrimary">
                Sin definir
              </Text>
            )}
          </View>
          <View style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color={colors.white} />
          </View>
        </View>

        {hasBudget ? (
          <>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(100, Math.max(2, pct))}%`,
                    backgroundColor: progressColor,
                  },
                ]}
              />
            </View>

            <View style={styles.statsRow}>
              <Stat
                label="Consumido"
                value={`${pct}%`}
                valueColor={progressColor}
              />
              <View style={styles.statDivider} />
              <Stat
                label="Restante"
                value={formatCurrency(Math.max(0, remaining), budget.currency)}
                valueColor={colors.success}
              />
              <View style={styles.statDivider} />
              <Stat label="Días restantes" value={`${budget.days_left}`} />
            </View>

            {summary ? (
              <>
                <View style={styles.hrule} />
                <View style={styles.statsRow}>
                  <Stat label="Movimientos" value={`${movements}`} />
                  <View style={styles.statDivider} />
                  <Stat
                    label="Categoría top"
                    value={topCategory?.category_name ?? "—"}
                  />
                </View>
              </>
            ) : null}
          </>
        ) : null}

        <View style={styles.tipRow}>
          <Magnus size="sm" mood="happy" bounce={false} />
          <Text variant="bodyMedium" color="textOnPrimary" style={{ flex: 1 }}>
            {tip}
          </Text>
        </View>
      </View>

      {/* Haz de brillo que barre la tarjeta periódicamente. */}
      <Animated.View pointerEvents="none" style={[styles.shine, shineStyle]}>
        <View style={styles.shineSoft} />
        <View style={styles.shineCore} />
        <View style={styles.shineSoft} />
      </Animated.View>
    </Pressable>
  );
}

/** Gráfica de líneas blanca y tenue con área rellena, anclada al fondo. */
function DecorLineChart() {
  const [width, setWidth] = useState(0);
  const height = 100;
  const n = SERIES.length;

  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  const points = SERIES.map((v, i) => ({
    x: n === 1 ? 0 : (width * i) / (n - 1),
    y: height - (v / 100) * height,
  }));

  // Columnas que rellenan el área bajo la línea (aproximación sin SVG).
  const COLS = 64;
  const colW = width / COLS;
  const valueAt = (px: number) => {
    const t = (px / width) * (n - 1);
    const i0 = Math.min(n - 2, Math.max(0, Math.floor(t)));
    const frac = t - i0;
    return SERIES[i0] + (SERIES[i0 + 1] - SERIES[i0]) * frac;
  };

  return (
    <View style={styles.chart} pointerEvents="none" onLayout={onLayout}>
      {width > 0 &&
        Array.from({ length: COLS }).map((_, c) => {
          const v = valueAt((c + 0.5) * colW);
          const h = (v / 100) * height;
          return (
            <View
              key={`c${c}`}
              style={[
                styles.fillCol,
                { left: c * colW, width: colW + 0.5, height: h },
              ]}
            />
          );
        })}
      {width > 0 &&
        points.slice(0, -1).map((p, i) => {
          const q = points[i + 1];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          return (
            <View
              key={`l${i}`}
              style={[
                styles.segment,
                {
                  left: p.x,
                  top: p.y,
                  width: len,
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            />
          );
        })}
      {width > 0 &&
        points.map((p, i) => (
          <View
            key={`d${i}`}
            style={[styles.dot, { left: p.x - 2.5, top: p.y - 2.5 }]}
          />
        ))}
    </View>
  );
}

function Stat({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.stat}>
      <Text variant="caption" color="textOnPrimary" style={styles.faded}>
        {label}
      </Text>
      <Text
        variant="bodyMedium"
        color="textOnPrimary"
        numberOfLines={1}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.brand,
    borderRadius: radius.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  pressed: { opacity: 0.95 },
  faded: { opacity: 0.72 },
  shine: {
    position: "absolute",
    top: -40,
    bottom: -40,
    left: 0,
    width: SHINE_W,
    flexDirection: "row",
    alignItems: "stretch",
  },
  shineSoft: { flex: 1, backgroundColor: "rgba(255,255,255,0.05)" },
  shineCore: { width: 22, backgroundColor: "rgba(255,255,255,0.16)" },
  chart: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  fillCol: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  segment: {
    position: "absolute",
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.32)",
    transformOrigin: "left center",
  },
  dot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  content: { padding: spacing.lg, gap: spacing.md },
  headerRow: { flexDirection: "row", alignItems: "flex-start" },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: radius.pill },
  statsRow: { flexDirection: "row", alignItems: "center" },
  stat: { flex: 1, gap: 2 },
  statDivider: {
    width: 1,
    alignSelf: "stretch",
    marginVertical: 2,
    marginHorizontal: spacing.md,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  hrule: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: spacing.sm,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
