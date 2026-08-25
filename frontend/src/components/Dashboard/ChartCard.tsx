import type { ReactNode } from 'react';

export default function ChartCard({
  title,
  isEmpty,
  emptyMessage = 'No data yet.',
  children,
}: {
  title: string;
  isEmpty: boolean;
  emptyMessage?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-amber-900/15 bg-cream p-4">
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      {isEmpty ? (
        <div className="flex h-48 items-center justify-center text-sm text-ink/60">
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
