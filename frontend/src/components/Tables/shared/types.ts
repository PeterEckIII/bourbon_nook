import type {
  Cell_Core,
  Header_Core,
  HeaderGroup,
  ReactTable,
  Row_Core,
} from '@tanstack/react-table';
import type { BottleTableFeatures } from '../../../hooks/useBottleTable';
import type { BottleResponseModel } from '../../../api/generated/bottles-api';
import type { ReviewResponseModel } from '../../../api/generated/reviews-api';
import type { ReviewTableFeatures } from '../../../hooks/useReviewTable';
import type { UserTableFeatures } from '../../../hooks/useUsersTable';
import type { UserResponseModel } from '../../../api/generated/users-api';

// TABLE TYPES
type BottleTable = ReactTable<BottleTableFeatures, BottleResponseModel>;
type ReviewTable = ReactTable<ReviewTableFeatures, ReviewResponseModel>;
type UserTable = ReactTable<UserTableFeatures, UserResponseModel>;

export type TableType = BottleTable | ReviewTable | UserTable;

// HEADER GROUP TYPES
type BottleHeaderGroups = HeaderGroup<BottleTableFeatures, BottleResponseModel>;
type ReviewHeaderGroups = HeaderGroup<ReviewTableFeatures, ReviewResponseModel>;
type UserHeaderGroups = HeaderGroup<UserTableFeatures, UserResponseModel>;

export type HeaderGroupType = BottleHeaderGroups | ReviewHeaderGroups | UserHeaderGroups;

// HEADER TYPES
type BottleHeaders = Header_Core<BottleTableFeatures, BottleResponseModel>;
type ReviewHeaders = Header_Core<ReviewTableFeatures, ReviewResponseModel>;
type UserHeaders = Header_Core<UserTableFeatures, UserResponseModel>;

export type HeaderType = BottleHeaders | ReviewHeaders | UserHeaders;

// ROW TYPES
type BottleRow = Row_Core<BottleTableFeatures, BottleResponseModel>;
type ReviewRow = Row_Core<ReviewTableFeatures, ReviewResponseModel>;
type UserRow = Row_Core<UserTableFeatures, UserResponseModel>;

export type RowType = BottleRow | ReviewRow | UserRow;

// CELL TYPES
type BottleCell = Cell_Core<BottleTableFeatures, BottleResponseModel>;
type ReviewCell = Cell_Core<ReviewTableFeatures, ReviewResponseModel>;
type UserCell = Cell_Core<UserTableFeatures, UserResponseModel>;

export type CellType = BottleCell | ReviewCell | UserCell;
