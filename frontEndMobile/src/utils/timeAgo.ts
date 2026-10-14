// src/utils/timeAgo.ts
// Ex. : il y a 2 h, hier, il y a 3 j, 3 oct.
export function timeAgo(input: string | number | Date): string {
  const date = new Date(input);
  const min = Math.floor((Date.now() - date.getTime()) / 60000);

  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;

  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;

  const d = Math.floor(h / 24);
  if (d === 1) return 'hier';
  if (d < 7) return `il y a ${d} j`;

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
