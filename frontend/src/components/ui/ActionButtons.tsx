import { Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import PlusIcon from '../Icons/PlusIcon';
import EditIcon from '../Icons/EditIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import ConfirmDialog from './ConfirmDialog';
import { useBottleDelete, getUserBottlesQueryKey } from '../../api/generated/bottles-api';
import { getApiErrorMessage } from '../../api/errors';
import ViewIcon from '../Icons/ViewIcon';
import {
  getUserReviewsQueryKey,
  useReviewByBottleId,
  useReviewDelete,
} from '../../api/generated/reviews-api';

const labeledButtonClasses =
  'inline-flex cursor-pointer items-center gap-2 rounded-md border border-ink/20 px-3 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:ring-offset-2 focus:ring-offset-cream';

interface ActionButtonsProps {
  entity: 'bottle' | 'review';
  bottleId?: string;
  onDeleted?: () => void;
  showLabels?: boolean;
  reviewId?: string;
}

export default function ActionButtons({
  entity,
  bottleId,
  onDeleted,
  showLabels = false,
  reviewId,
}: ActionButtonsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const review = useReviewByBottleId(bottleId || '');
  let hasReview: boolean;
  if (review.data) {
    hasReview = true;
  } else {
    hasReview = false;
  }
  const {
    mutate: deleteBottle,
    isPending: isBottleDeletePending,
    error: bottleError,
  } = useBottleDelete({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getUserBottlesQueryKey() });
        setIsConfirmOpen(false);
        onDeleted?.();
      },
    },
  });
  const {
    mutate: deleteReview,
    isPending: isReviewDeletePending,
    error: reviewError,
  } = useReviewDelete({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getUserReviewsQueryKey() });
        setIsConfirmOpen(false);
        onDeleted?.();
      },
    },
  });
  return (
    <div className={showLabels ? 'flex flex-wrap gap-3' : 'flex justify-around'}>
      <div>
        {entity === 'bottle' ? (
          <Link
            to={hasReview ? '/reviews/$reviewId' : `/reviews/new`}
            params={hasReview ? { reviewId: review?.data?.id } : undefined}
            search={hasReview ? undefined : { bottleId }}
            title={hasReview ? 'View Review' : 'Write Review'}
            aria-label={hasReview ? 'View Review' : 'Write Review'}
            className={showLabels ? labeledButtonClasses : undefined}
          >
            {hasReview ? <ViewIcon /> : <PlusIcon />}
            {showLabels ? (hasReview ? 'View Review' : 'Write Review') : null}
          </Link>
        ) : null}
      </div>
      <div>
        <Link
          to={entity === 'bottle' ? '/bottles/$bottleId/edit' : '/reviews/$reviewId/edit'}
          params={entity === 'bottle' ? { bottleId: bottleId! } : { reviewId: reviewId! }}
          title={entity === 'bottle' ? 'Edit Bottle' : 'Edit Review'}
          aria-label={entity === 'bottle' ? 'Edit Bottle' : 'Edit Review'}
          className={showLabels ? labeledButtonClasses : undefined}
        >
          <EditIcon />
          {showLabels ? (entity === 'bottle' ? 'Edit Bottle' : 'Edit Review') : null}
        </Link>
      </div>
      <div>
        <button
          type="button"
          title={entity === 'bottle' ? 'Delete Bottle' : 'Delete Review'}
          aria-label={entity === 'bottle' ? 'Delete Bottle' : 'Delete Review'}
          onClick={() => setIsConfirmOpen(true)}
          className={showLabels ? labeledButtonClasses : 'cursor-pointer'}
        >
          <DeleteIcon />
          {showLabels ? (entity === 'bottle' ? 'Delete Bottle' : 'Delete Review') : null}
        </button>
        <ConfirmDialog
          open={isConfirmOpen}
          title={entity === 'bottle' ? 'Delete this bottle?' : 'Delete this review?'}
          description={
            bottleError
              ? getApiErrorMessage(bottleError)
              : reviewError
                ? getApiErrorMessage(reviewError)
                : 'This action cannot be undone.'
          }
          confirmLabel="Delete"
          isConfirming={isBottleDeletePending || isReviewDeletePending}
          onConfirm={
            entity === 'bottle'
              ? () => deleteBottle({ bottleId: bottleId! })
              : () => deleteReview({ reviewId: reviewId! })
          }
          onCancel={() => setIsConfirmOpen(false)}
        />
      </div>
    </div>
  );
}
