import { StyleSheet, View } from "react-native";

import { Badge, Card, Text } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { spacing } from "@/theme";
import { SyncJob, SyncStatus } from "@/types/models";

const STATUS_LABEL: Record<
  SyncStatus,
  { label: string; tone: "success" | "danger" | "neutral" }
> = {
  completed: { label: "Completado", tone: "success" },
  failed: { label: "Falló", tone: "danger" },
  running: { label: "En curso", tone: "neutral" },
  pending: { label: "Pendiente", tone: "neutral" },
};

export function SyncJobRow({ job }: { job: SyncJob }) {
  const status = STATUS_LABEL[job.status];

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="bodyMedium">{formatDate(job.created_at)}</Text>
          <Text variant="caption" color="textSecondary">
            {job.status === "failed"
              ? (job.error_message ?? "Error desconocido")
              : `${job.emails_fetched} correos · ${job.transactions_created} gastos`}
          </Text>
        </View>
        <Badge label={status.label} tone={status.tone} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
});
