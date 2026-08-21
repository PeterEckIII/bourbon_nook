export function formatPrice(x: number) {
  return `$${x
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

const dateFormatter = Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function formatDate(value: string | undefined): string | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!match) return undefined;
  const [, year, month, day] = match;
  return dateFormatter.format(new Date(Number(year), Number(month) - 1, Number(day)));
}
