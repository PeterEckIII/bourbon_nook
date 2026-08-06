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

// TABLE TYPES
type BottleTable = ReactTable<BottleTableFeatures, BottleResponseModel>;
type ReviewTable = ReactTable<ReviewTableFeatures, ReviewResponseModel>;

export type TableType = BottleTable | ReviewTable;

// HEADER GROUP TYPES
type BottleHeaderGroups = HeaderGroup<BottleTableFeatures, BottleResponseModel>;
type ReviewHeaderGroups = HeaderGroup<ReviewTableFeatures, ReviewResponseModel>;

export type HeaderGroupType = BottleHeaderGroups | ReviewHeaderGroups;

// HEADER TYPES
type BottleHeaders = Header_Core<BottleTableFeatures, BottleResponseModel>;
type ReviewHeaders = Header_Core<ReviewTableFeatures, ReviewResponseModel>;

export type HeaderType = BottleHeaders | ReviewHeaders;

// ROW TYPES
type BottleRow = Row_Core<BottleTableFeatures, BottleResponseModel>;
type ReviewRow = Row_Core<ReviewTableFeatures, ReviewResponseModel>;

export type RowType = BottleRow | ReviewRow;

// CELL TYPES
type BottleCell = Cell_Core<BottleTableFeatures, BottleResponseModel>;
type ReviewCell = Cell_Core<ReviewTableFeatures, ReviewResponseModel>;

export type CellType = BottleCell | ReviewCell;
