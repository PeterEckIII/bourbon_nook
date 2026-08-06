import type { TableType, CellType } from './types';

interface TBodyCellProps {
  table: TableType;
  cell: CellType;
}

export default function TBodyCell({ table, cell }: TBodyCellProps) {
  return (
    <td key={cell.id} className="px-4 py-3 text-sm text-ink">
      <table.FlexRender cell={cell} />
    </td>
  );
}
