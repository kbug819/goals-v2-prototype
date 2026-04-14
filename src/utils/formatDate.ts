/**
 * Format an ISO date string (YYYY-MM-DD) to US format (MM/DD/YYYY).
 */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split("-");
  if (!year || !month || !day) return isoDate;
  return `${parseInt(month)}/${parseInt(day)}/${year}`;
}

/**
 * Format an ISO date string to a short US label (M/D) for chart axes.
 */
export function formatDateShort(isoDate: string): string {
  const [, month, day] = isoDate.slice(0, 10).split("-");
  if (!month || !day) return isoDate;
  return `${parseInt(month)}/${parseInt(day)}`;
}
