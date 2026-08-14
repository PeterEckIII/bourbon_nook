import TBodyCell from './TBodyCell';
import type { CellType, RowType, TableType } from '../shared/types';

interface TBodyRowProps {
  table: TableType;
  row: RowType;
}

export default function TBodyRow({ table, row }: TBodyRowProps) {
  // Not every table registers columnVisibilityFeature, so getVisibleCells may not exist.
  const rowWithVisibility = row as RowType & { getVisibleCells?: () => CellType[] };
  const cells = rowWithVisibility.getVisibleCells?.() ?? row.getAllCells();

  return (
    <tr
      key={row.id}
      className="border-b border-amber-900/10 transition-colors duration-150 last:border-0 hover:bg-amber-600/5"
    >
      {cells.map((cell) => (
        <TBodyCell table={table} cell={cell} />
      ))}
    </tr>
  );
}
