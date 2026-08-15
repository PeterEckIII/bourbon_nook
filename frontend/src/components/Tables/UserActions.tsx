import { Link } from '@tanstack/react-router';
import EditIcon from '../Icons/EditIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetUsersQueryKey, useDeleteUser } from '../../api/generated/users-api';
import { getApiErrorMessage } from '../../api/errors';

interface UserActionProps {
  userId: string;
  onDeleted?: () => void;
}

export default function UserActions({ userId, onDeleted }: UserActionProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    mutate: deleteUser,
    isPending,
    error,
  } = useDeleteUser({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetUsersQueryKey() });
        setIsConfirmOpen(false);
        onDeleted?.();
      },
    },
  });
  return (
    <div className="flex justify-evenly mx-4">
      <div>
        <Link
          to="/admin/users/$userId/edit"
          params={{ userId }}
          title="Edit User"
          aria-label="Edit User"
        >
          <EditIcon />
        </Link>
      </div>
      <div>
        <button
          type="button"
          title="Delete User"
          aria-label="Delete User"
          onClick={() => setIsConfirmOpen(true)}
          className="cursor-pointer"
        >
          <DeleteIcon />
        </button>
        <ConfirmDialog
          open={isConfirmOpen}
          title="Delete this user?"
          description={error ? getApiErrorMessage(error) : 'This action cannot be undone.'}
          confirmLabel="Delete"
          isConfirming={isPending}
          onConfirm={() => deleteUser({ id: userId })}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </div>
    </div>
  );
}
