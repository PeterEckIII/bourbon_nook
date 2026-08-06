import TBodyRow from '../shared/TBodyRow';
import type { TableType } from '../shared/types';

interface TBodyProps {
  table: TableType;
}

export default function TBody({ table }: TBodyProps) {
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <TBodyRow table={table} row={row} />
      ))}
    </tbody>
  );
}
