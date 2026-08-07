import {
  createColumnHelper,
  createSortedRowModel,
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

export const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    text: sortFn_text,
    datetime: sortFn_datetime,
  },
});

export type BottleTableFeatures = typeof features;

const columnHelper = createColumnHelper<
  BottleTableFeatures,
  BottleResponseModel
>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'rowNumber',
    header: '#',
    cell: (info) => info.row.getDisplayIndex() + 1,
  }),
  columnHelper.group({
    header: 'Bottle',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <BottleName
            name={info.getValue()!}
            bottleId={info.row.original.id!}
          />
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusPill value={info.getValue()} />,
      }),
    ]),
  }),
  columnHelper.group({
    header: 'Origin',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('distillery', {
        header: 'Distillery',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('country', {
        header: 'Location',
        cell: (info) => info.row.original.region + ', ' + info.getValue(),
        footer: (props) => props.column.id,
      }),
    ]),
  }),
  columnHelper.group({
    header: 'Specs',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('price', {
        header: 'Price ($)',
        cell: (info) => `$ ${info.getValue()?.toFixed(2)}`,
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('proof', {
        header: 'Proof',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('releaseYear', {
        header: 'Release Year',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
    ]),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (props) => (
      <ActionButtons bottleId={props.row.original.id as string} />
    ),
  }),
]);

export default function useBottleTable({
  data,
}: {
  data: BottleResponseModel[];
}) {
  const table = useTable({
    key: 'bottle-table',
    features,
    columns,
    data,
    initialState: {
      sorting: [
        {
          id: 'name',
          desc: true,
        },
      ],
    },
  });

  return { table };
}
