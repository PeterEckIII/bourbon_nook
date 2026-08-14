import type { TableType, HeaderType } from './types';

interface TFootCellProps {
  table: TableType;
  header: HeaderType;
}

export default function TFootCell({ table, header }: TFootCellProps) {
  return (
    <td
      key={header.id}
      colSpan={header.colSpan}
      rowSpan={header.rowSpan}
      className="border-t border-amber-900/15 bg-cream px-4 py-3 text-left text-xs font-semibold tracking-wide text-ink/60 uppercase"
    >
      {/* table and header are always derived from the same concrete table instance by the caller;
          TS can't express that invariant across this union of table/header instantiations. */}
      <table.FlexRender footer={header as never} />
    </td>
  );
}
