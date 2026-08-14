export function formatPrice(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDate(date: Date): string {
  const dtf = new Intl.DateTimeFormat('en', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
  });
  return dtf.format(date);
}
