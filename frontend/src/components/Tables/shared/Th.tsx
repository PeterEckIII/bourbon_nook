import type { TableType, HeaderType } from '../shared/types';

interface ThProps {
  table: TableType;
  header: HeaderType;
}

export default function Th({ table, header }: ThProps) {
  const canSort = header.column.getCanSort();
  // Read the sort direction off `table.state` (the React-tracked snapshot) rather than
  // calling `header.column.getIsSorted()` directly in JSX -- the latter reads the table's
  // internal store outside of props/state, so the React Compiler's memoization can freeze
  // it at whatever value it had on first render instead of updating it after each click.
  const sortEntry = table.state.sorting.find((s) => s.id === header.column.id);
  const isSorted = sortEntry ? (sortEntry.desc ? 'desc' : 'asc') : false;
  const canRemoveSort = table.options.enableSortingRemoval ?? true;
  const nextOrder = !isSorted ? 'asc' : isSorted === 'asc' ? 'desc' : canRemoveSort ? false : 'asc';

  return (
    <th
      key={header.id}
      colSpan={header.colSpan}
      rowSpan={header.rowSpan}
      className="sticky top-0 z-10 border-b border-amber-900/15 bg-cream px-4 py-3 text-xs font-semibold tracking-wide text-ink/60 uppercase align-bottom"
    >
      <div
        className={canSort ? 'sortable-header' : ''}
        onClick={header.column.getToggleSortingHandler()}
        title={
          canSort
            ? nextOrder === 'asc'
              ? 'Sort ascending'
              : nextOrder === 'desc'
                ? 'Sort descending'
                : 'Clear sort'
            : undefined
        }
      >
        {/* table and header are always derived from the same concrete table instance by the caller;
            TS can't express that invariant across this union of table/header instantiations. */}
        <table.FlexRender header={header as never} />
        {{
          asc: ' 🔼',
          desc: ' 🔽',
        }[isSorted as string] ?? null}
      </div>
    </th>
  );
}
