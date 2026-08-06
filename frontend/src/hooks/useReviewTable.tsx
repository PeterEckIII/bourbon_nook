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

export const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    text: sortFn_text,
    datetime: sortFn_datetime,
  },
});

export type ReviewTableFeatures = typeof features;

const columnHelper = createColumnHelper<
  ReviewTableFeatures,
  ReviewResponseModel
>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'rowNumber',
    header: '#',
    cell: (info) => info.row.getDisplayIndex() + 1,
  }),
]);

export default function useReviewTable({
  data,
}: {
  data: ReviewResponseModel[];
}) {
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
