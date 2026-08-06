import TBodyCell from './TBodyCell';
import type { RowType, TableType } from '../shared/types';

interface TBodyRowProps {
  table: TableType;
  row: RowType;
}

export default function TBodyRow({ table, row }: TBodyRowProps) {
  return (
    <tr
      key={row.id}
      className="border-b border-amber-900/10 transition-colors duration-150 last:border-0 hover:bg-amber-600/5"
    >
      {row.getAllCells().map((cell) => (
        <TBodyCell table={table} cell={cell} />
      ))}
    </tr>
  );
}
