import THeadRow from './THeadRow';
import type { TableType } from './types';

interface THeadProps {
  table: TableType;
}

export default function THead({ table }: THeadProps) {
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <THeadRow table={table} headerGroup={headerGroup} />
      ))}
    </thead>
  );
}
