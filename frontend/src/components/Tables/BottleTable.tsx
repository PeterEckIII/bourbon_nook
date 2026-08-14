import { Link } from '@tanstack/react-router';
import type { BottleResponseModel } from '../../api/generated/bottles-api';
import useBottleTable from '../../hooks/useBottleTable';
import TBody from './shared/TBody';
import TFoot from './shared/TFoot';
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
    <>
      <div className="relative mb-3 sm:max-w-xs">
        <label htmlFor="bottle-search" className="sr-only">
          Search bottles
        </label>
        <input
          id="bottle-search"
          type="text"
          value={table.state.globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          placeholder="Search bottles..."
          className="w-full rounded-md border border-ink/20 bg-cream px-3 py-2 pr-8 text-sm text-ink placeholder:text-ink/40 transition-colors duration-150 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:ring-offset-2 focus:ring-offset-cream"
        />
        {!!table.state.globalFilter && (
          <button
            type="button"
            onClick={() => table.setGlobalFilter('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-0.5 text-ink/50 transition-colors duration-150 hover:text-ink focus:outline-none focus:ring-2 focus:ring-amber-500/70"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
      <div
        className={`overflow-x-auto rounded-lg border border-amber-900/15 bg-cream ${className}`}
      >
        <table className="w-full min-w-max border-collapse text-left">
          <THead table={table} />
          <TBody table={table} />
          <TFoot table={table} />
        </table>
      </div>
    </>
  );
}
