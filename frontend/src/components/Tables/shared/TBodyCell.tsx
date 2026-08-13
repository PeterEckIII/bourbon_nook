import type { TableType, CellType } from './types';

interface TBodyCellProps {
  table: TableType;
  cell: CellType;
}

export default function TBodyCell({ table, cell }: TBodyCellProps) {
  return (
    <td key={cell.id} className="px-4 py-3 text-sm text-ink">
      {/* table and cell are always derived from the same concrete table instance by the caller;
          TS can't express that invariant across this union of table/cell instantiations. */}
      <table.FlexRender cell={cell as never} />
    </td>
  );
}
