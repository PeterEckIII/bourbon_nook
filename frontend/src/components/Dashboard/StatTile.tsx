export default function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-amber-900/15 bg-cream px-4 py-5">
      <div className="text-xs font-semibold tracking-wide text-ink/50 uppercase">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-ink">{value}</div>
    </div>
  );
}
