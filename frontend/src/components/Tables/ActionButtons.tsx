import { Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import PlusIcon from '../Icons/PlusIcon';
import EditIcon from '../Icons/EditIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import ConfirmDialog from '../ui/ConfirmDialog';
import {
  useBottleDelete,
  getUserBottlesQueryKey,
} from '../../api/generated/bottles-api';
import { getApiErrorMessage } from '../../api/errors';

export default function ActionButtons({ bottleId }: { bottleId: string }) {
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
      },
    },
  });
  return (
    <div className="flex justify-around">
      <div>
        <button type="button">
          <Link to="/reviews/new" title="Write Review" aria-label="Add Review">
            <PlusIcon />
          </Link>
        </button>
      </div>
      <div>
        <button type="button">
          <Link
            to="/bottles/$bottleId/edit"
            params={{ bottleId }}
            title="Edit Bottle"
            aria-label="Edit Bottle"
          >
            <EditIcon />
          </Link>
        </button>
      </div>
      <div>
        <button
          type="button"
          title="Delete Bottle"
          aria-label="Delete Bottle"
          onClick={() => setIsConfirmOpen(true)}
        >
          <DeleteIcon />
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
