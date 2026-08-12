import { Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import PlusIcon from '../Icons/PlusIcon';
import EditIcon from '../Icons/EditIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import ConfirmDialog from './ConfirmDialog';
import {
  useBottleDelete,
  getUserBottlesQueryKey,
} from '../../api/generated/bottles-api';
import { getApiErrorMessage } from '../../api/errors';

const labeledButtonClasses =
  'inline-flex cursor-pointer items-center gap-2 rounded-md border border-ink/20 px-3 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:ring-offset-2 focus:ring-offset-cream';

export default function ActionButtons({
  bottleId,
  onDeleted,
  showLabels = false,
}: {
  bottleId: string;
  onDeleted?: () => void;
  showLabels?: boolean;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    mutate: deleteBottle,
    isPending,
    error,
  } = useBottleDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getUserBottlesQueryKey() });
        setIsConfirmOpen(false);
        onDeleted?.();
      },
    },
  });
  return (
    <div
      className={showLabels ? 'flex flex-wrap gap-3' : 'flex justify-around'}
    >
      <div>
        <Link
          to="/reviews/new"
          title="Write Review"
          aria-label="Write Review"
          className={showLabels ? labeledButtonClasses : undefined}
        >
          <PlusIcon />
          {showLabels && 'Write Review'}
        </Link>
      </div>
      <div>
        <Link
          to="/bottles/$bottleId/edit"
          params={{ bottleId }}
          title="Edit Bottle"
          aria-label="Edit Bottle"
          className={showLabels ? labeledButtonClasses : undefined}
        >
          <EditIcon />
          {showLabels && 'Edit Bottle'}
        </Link>
      </div>
      <div>
        <button
          type="button"
          title="Delete Bottle"
          aria-label="Delete Bottle"
          onClick={() => setIsConfirmOpen(true)}
          className={showLabels ? labeledButtonClasses : 'cursor-pointer'}
        >
          <DeleteIcon />
          {showLabels && 'Delete Bottle'}
        </button>
        <ConfirmDialog
          open={isConfirmOpen}
          title="Delete this bottle?"
          description={
            error ? getApiErrorMessage(error) : 'This action cannot be undone.'
          }
          confirmLabel="Delete"
          isConfirming={isPending}
          onConfirm={() => deleteBottle({ bottleId })}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </div>
    </div>
  );
}
