import {
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFn_text,
  sortFn_alphanumeric,
  createColumnHelper,
  useTable,
} from '@tanstack/react-table';
import type { UserResponseModel } from '../api/generated/users-api';
import UserActions from '../components/Tables/UserActions';

export const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    text: sortFn_text,
    datetime: sortFn_alphanumeric,
  },
});

export type UserTableFeatures = typeof features;

const columnHelper = createColumnHelper<UserTableFeatures, UserResponseModel>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'rowNumber',
    header: '#',
    cell: (info) => info.row.getDisplayIndex() + 1,
  }),
  columnHelper.accessor('userId', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('username', {
    header: 'Username',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    header: 'Actions',
    cell: (info) => {
      const userId = info.row.original.userId;
      return <UserActions userId={userId} />;
    },
  }),
]);

export default function useUsersTable({ data }: { data: UserResponseModel[] }) {
  const table = useTable({
    key: 'users-table',
    features,
    columns,
    data,
  });

  return { table };
}
