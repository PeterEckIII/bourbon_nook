import { Link } from '@tanstack/react-router';
import type { BottleResponseModel } from '../../api/generated/bottles-api';
import useBottleTable from '../../hooks/useBottleTable';
import TBody from './shared/TBody';
import THead from './shared/THead';

export default function BottleTable({
  data,
  className = '',
}: {
  data: BottleResponseModel[];
  className?: string;
}) {
  const { table } = useBottleTable({ data });

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-amber-900/15 bg-cream px-4 py-12 text-center text-sm text-ink/60">
        No bottles yet.
        <Link to="/bottles/new">Add one</Link>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-amber-900/15 bg-cream ${className}`}>
      <table className="w-full min-w-max border-collapse text-left">
        <THead table={table} />
        <TBody table={table} />
      </table>
    </div>
  );
}
