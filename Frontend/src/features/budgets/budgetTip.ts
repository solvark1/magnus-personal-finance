import { formatCurrency } from "@/lib/format";

/** Nombre del mes en español, p.ej. "junio". */
export function monthName(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const d = new Date(year, (month || 1) - 1, 1);
  return d.toLocaleDateString("es-CR", { month: "long" });
}

/**
 * Consejo corto y contextual de Magnus según el avance del presupuesto.
 * Compara el porcentaje gastado contra el tiempo transcurrido del mes.
 */
export function budgetTip(
  spent: number,
  amount: number,
  daysLeft: number,
  currency = "CRC",
): string {
  if (amount <= 0) {
    return "Define un presupuesto mensual y te ayudo a cuidarlo de cerca.";
  }

  const ratio = spent / amount;
  const pct = Math.round(ratio * 100);

  // Progreso del mes (0 a 1) a partir de la fecha actual.
  const now = new Date();
  const totalDays = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const timeRatio = now.getDate() / totalDays;

  if (spent === 0) {
    return "Mes nuevo y cuenta en cero. ¡A cuidar cada colón!";
  }
  if (ratio >= 1) {
    const over = formatCurrency(spent - amount, currency);
    return `Te pasaste del presupuesto por ${over}. El próximo mes lo ajustamos juntos.`;
  }
  if (ratio >= 0.9) {
    return `Estás al ${pct}% y quedan ${daysLeft} días. Vamos con calma hasta fin de mes.`;
  }
  if (ratio > timeRatio + 0.15) {
    return `Vas más rápido que el calendario: ${pct}% gastado y aún faltan ${daysLeft} días.`;
  }
  if (ratio < timeRatio - 0.15) {
    return `¡Buen trabajo! Apenas llevas el ${pct}% del presupuesto con ${daysLeft} días por delante.`;
  }
  if (ratio < 0.5) {
    return `Vas muy bien: solo el ${pct}% gastado y ${daysLeft} días para terminar el mes.`;
  }
  return `Vas en buen ritmo: ${pct}% del presupuesto y ${daysLeft} días para fin de mes.`;
}
