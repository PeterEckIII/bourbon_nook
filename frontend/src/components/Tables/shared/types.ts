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

export type TableType =
  | ReactTable<BottleTableFeatures, BottleResponseModel>
  | ReactTable<ReviewTableFeatures, ReviewResponseModel>;

export type HeaderGroupType =
  | HeaderGroup<BottleTableFeatures, BottleResponseModel>
  | HeaderGroup<ReviewTableFeatures, ReviewResponseModel>;

export type HeaderType =
  | Header_Core<BottleTableFeatures, BottleResponseModel>
  | Header_Core<ReviewTableFeatures, ReviewResponseModel>;

export type RowType =
  | Row_Core<BottleTableFeatures, BottleResponseModel>
  | Row_Core<ReviewTableFeatures, ReviewResponseModel>;

export type CellType =
  | Cell_Core<BottleTableFeatures, BottleResponseModel>
  | Cell_Core<ReviewTableFeatures, ReviewResponseModel>;
