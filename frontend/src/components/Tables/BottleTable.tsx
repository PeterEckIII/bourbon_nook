import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import type { BottleResponseModel } from '../../api/generated/bottles-api';
import StatusPill from './StatusPill';
import ActionButtons from './ActionButtons';

const features = tableFeatures({
  columnFilteringFeature: {},
});

const columnHelper = createColumnHelper<typeof features, BottleResponseModel>();

const columns = columnHelper.columns([
  columnHelper.group({
    header: 'Information',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
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
      columnHelper.accessor('producer', {
        header: 'Producer',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('country', {
        header: 'Country',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('region', {
        header: 'Region',
        cell: (info) => info.getValue(),
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
      columnHelper.accessor('age', {
        header: 'Age',
        cell: (info) => info.getValue(),
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
  columnHelper.group({
    header: 'Barrel',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('barrelInformation', {
        header: 'Barrel Details',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('finishing', {
        header: 'Finishing',
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
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: 'type',
//     header: 'Type',
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//
//   },
//   {
//     accessorKey: 'distillery',
//     header: 'Distillery',
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: 'producer',
//     header: 'Producer',
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: 'country',
//     header: 'Country',
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: 'region',
//     header: 'Region',
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: 'price',
//     header: 'Price ($)',
//     cell: (info) => '$' + info.getValue(),
//   },
//   {
//     accessorKey: 'age',
//     header: 'Age',
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: 'proof',
//     header: 'Proof',
//     cell: (info) => info.getValue(),
//   },
// ];

export default function BottleTable({ data }: { data: BottleResponseModel[] }) {
  const table = useTable({
    key: 'bottle-table',
    features,
    columns,
    data,
  });

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-amber-900/15 bg-cream px-4 py-12 text-center text-sm text-ink/60">
        No bottles yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-amber-900/15 bg-cream">
      <table className="w-full min-w-max border-collapse text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) =>
                header.rowSpan === 0 || header.colSpan === 0 ? null : (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    rowSpan={header.rowSpan}
                    className="sticky top-0 z-10 border-b border-amber-900/15 bg-cream px-4 py-3 text-xs font-semibold tracking-wide text-ink/60 uppercase"
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ),
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-amber-900/10 transition-colors duration-150 last:border-0 hover:bg-amber-600/5"
            >
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm text-ink">
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
