import Th from './Th';
import type { TableType, HeaderGroupType } from '../shared/types';

interface TrowProps {
  table: TableType;
  headerGroup: HeaderGroupType;
}

export default function THeadRow({ table, headerGroup }: TrowProps) {
  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) =>
        header.rowSpan === 0 || header.colSpan === 0 ? null : (
          <Th table={table} header={header} />
        ),
      )}
    </tr>
  );
}
