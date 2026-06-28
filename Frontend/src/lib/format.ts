/** Utilidades de formato para moneda y fechas (es-CR). */

const currencyFormatters: Record<string, Intl.NumberFormat> = {};

function getCurrencyFormatter(currency: string): Intl.NumberFormat {
  if (!currencyFormatters[currency]) {
    currencyFormatters[currency] = new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return currencyFormatters[currency];
}

/** Formatea un monto: 38450 -> "₡38 450". */
export function formatCurrency(amount: number, currency = "CRC"): string {
  try {
    return getCurrencyFormatter(currency).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString("es-CR")}`;
  }
}

const dateFormatter = new Intl.DateTimeFormat("es-CR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dayMonthFormatter = new Intl.DateTimeFormat("es-CR", {
  day: "numeric",
  month: "long",
});

/** "2026-06-26" -> "26 jun 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFormatter.format(d);
}

/** Etiqueta amigable para agrupar transacciones por día. */
export function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return "Hoy";
  if (sameDay(d, yesterday)) return "Ayer";
  return dayMonthFormatter.format(d);
}

/** Capitaliza la primera letra. */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
