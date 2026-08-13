import type { TableType, HeaderType } from '../shared/types';

interface ThProps {
  table: TableType;
  header: HeaderType;
}

export default function Th({ table, header }: ThProps) {
  return (
    <th
      key={header.id}
      colSpan={header.colSpan}
      rowSpan={header.rowSpan}
      className="sticky top-0 z-10 border-b border-amber-900/15 bg-cream px-4 py-3 text-xs font-semibold tracking-wide text-ink/60 uppercase align-bottom"
    >
      <div
        className={header.column.getCanSort() ? 'sortable-header' : ''}
        onClick={header.column.getToggleSortingHandler()}
        title={
          header.column.getCanSort()
            ? header.column.getNextSortingOrder() === 'asc'
              ? 'Sort ascending'
              : header.column.getNextSortingOrder() === 'desc'
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
        }[header.column.getIsSorted() as string] ?? null}
      </div>
    </th>
  );
}
