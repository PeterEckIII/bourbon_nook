export default function StatusPill({ value }: { value: unknown }) {
  const opened = typeof value === 'string' && value === 'OPENED';
  const sealed = typeof value === 'string' && value === 'SEALED';
  const finished = typeof value === 'string' && value === 'FINISHED';
  return (
    <div
      className={
        opened
          ? 'border border-terracotta/40 bg-terracotta/30 text-barrel py-2 px-4 rounded-lg text-center'
          : sealed
            ? 'border border-amber-400/60 bg-amber-200 text-amber-900 py-2 px-4 rounded-lg text-center'
            : finished
              ? 'border border-ink/25 bg-ink/15 text-ink py-2 px-4 rounded-lg text-center'
              : ''
      }
    >
      {value as string}
    </div>
  );
}
