import type { Pub } from "../types";

const MONTHS = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(pub: Pick<Pub, "y" | "m" | "d">): string {
  if (!pub.y) return "Date unknown";
  if (pub.m && pub.d) return `${pub.d} ${MONTHS[pub.m]} ${pub.y}`;
  if (pub.m) return `${MONTHS[pub.m]} ${pub.y}`;
  return `${pub.y}`;
}

export function decadeLabel(year: number): string {
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}
