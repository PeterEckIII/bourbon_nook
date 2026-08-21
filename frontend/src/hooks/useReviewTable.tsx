import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import type { ReviewResponseModel } from '../api/generated/reviews-api';
import BottleName from '../components/Tables/BottleName';
import { formatDate } from '../utils/format';

export const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    text: sortFn_text,
    datetime: sortFn_datetime,
  },
});

export type ReviewTableFeatures = typeof features;

const columnHelper = createColumnHelper<ReviewTableFeatures, ReviewResponseModel>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'rowNumber',
    header: '#',
    cell: (info) => info.row.getDisplayIndex() + 1,
  }),
  columnHelper.accessor('bottleId', {
    header: 'Bottle',
    cell: (info) => <BottleName bottleId={info.getValue()!} reviewId={info.row.original.id!} />,
  }),
  columnHelper.accessor('reviewDate', {
    header: 'Reviewed On',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('valueScore', {
    header: 'Value',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('overallRating', {
    header: 'Overall',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (props) => props.getValue(),
  }),
]);

export default function useReviewTable({ data }: { data: ReviewResponseModel[] }) {
  const table = useTable({
    key: 'review-table',
    features,
    columns,
    data,
    initialState: {
      sorting: [
        {
          id: 'rowNumber',
          desc: true,
        },
      ],
    },
  });

  return { table };
}
