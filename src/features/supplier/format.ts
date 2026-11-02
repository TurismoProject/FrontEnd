export const BUSINESS_TIME_ZONE = "America/Maceio";

export function countLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function localDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function displayDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function departureDate(value: string, timeZone = BUSINESS_TIME_ZONE) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
}

export function currency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function nextDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

/** Filtros de operação usam explicitamente o fuso de Maceió, mostrado na interface. */
export function departurePeriod(from: string, to: string) {
  return {
    startsFrom: from ? `${from}T00:00:00-03:00` : undefined,
    startsBefore: to ? `${nextDate(to)}T00:00:00-03:00` : undefined,
  };
}

export function validatePeriod(from: string, to: string, maxDays?: number) {
  if (from && to && from > to)
    return "A data final deve ser igual ou posterior à inicial.";
  if (maxDays && (Date.parse(to) - Date.parse(from)) / 86400000 >= maxDays) {
    return `Selecione um período de até ${maxDays} dias.`;
  }
  return "";
}
