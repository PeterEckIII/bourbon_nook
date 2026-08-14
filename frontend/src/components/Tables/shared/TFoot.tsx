import TFootRow from './TFootRow';
import type { TableType } from './types';

interface TFootProps {
  table: TableType;
}

export default function TFoot({ table }: TFootProps) {
  return (
    <tfoot>
      {table.getFooterGroups().map((footerGroup) => (
        <TFootRow table={table} headerGroup={footerGroup} />
      ))}
    </tfoot>
  );
}
