import {
  aggregationFn_count,
  aggregationFn_sum,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowAggregationFeature,
  rowSortingFeature,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import ActionButtons from '../components/ui/ActionButtons';
import type { BottleResponseModel } from '../api/generated/bottles-api';
import StatusPill from '../components/Tables/StatusPill';
import BottleName from '../components/Tables/shared/BottleName';
import { useState } from 'react';
import { formatPrice } from '../utils/format';

export const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    text: sortFn_text,
    datetime: sortFn_datetime,
  },
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  columnVisibilityFeature,
  rowAggregationFeature,
  aggregationFns: {
    count: aggregationFn_count,
    sum: aggregationFn_sum,
  },
});

export type BottleTableFeatures = typeof features;

const columnHelper = createColumnHelper<BottleTableFeatures, BottleResponseModel>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'rowNumber',
    header: '#',
    cell: (info) => info.row.getDisplayIndex() + 1,
    aggregationFn: 'count',
    footer: (props) => props.column.getAggregationValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Added',
    cell: (info) => info.getValue(),
    sortFn: 'datetime',
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => <BottleName name={info.getValue()!} bottleId={info.row.original.id!} />,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusPill value={info.getValue()} />,
  }),
  columnHelper.accessor('distillery', {
    header: 'Distillery',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('country', {
    header: 'Location',
    cell: (info) => info.row.original.region + ', ' + info.getValue(),
  }),
  columnHelper.accessor('price', {
    header: 'Price ($)',
    cell: (info) => `$ ${info.getValue()?.toFixed(2)}`,
    footer: (props) =>
      `$ ${formatPrice(Number((props.column.getAggregationValue() as number).toFixed(2)))}`,
    aggregationFn: 'sum',
  }),
  columnHelper.accessor('proof', {
    header: 'Proof',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('releaseYear', {
    header: 'Release Year',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (props) => <ActionButtons bottleId={props.row.original.id as string} />,
  }),
]);

export default function useBottleTable({ data }: { data: BottleResponseModel[] }) {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const table = useTable({
    key: 'bottle-table',
    features,
    columns,
    data,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      sorting: [
        {
          id: 'createdAt',
          desc: true,
        },
      ],
      columnVisibility: {
        createdAt: false,
      },
    },
  });

  return { table };
}
