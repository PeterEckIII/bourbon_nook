import TFootCell from './TFootCell';
import type { TableType, HeaderGroupType } from './types';

interface TFootRowProps {
  table: TableType;
  headerGroup: HeaderGroupType;
}

export default function TFootRow({ table, headerGroup }: TFootRowProps) {
  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) =>
        header.rowSpan === 0 || header.colSpan === 0 ? null : (
          <TFootCell key={header.id} table={table} header={header} />
        ),
      )}
    </tr>
  );
}
