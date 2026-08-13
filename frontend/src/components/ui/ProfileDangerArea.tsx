import { useState } from 'react';
import { getApiErrorMessage } from '../../api/errors';
import { getGetUsersQueryKey, useDeleteAccount } from '../../api/generated/users-api';
import DeleteIcon from '../Icons/DeleteIcon';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import DeleteAccountDialog from './DeleteAccountDialog';

interface ProfileDangerAreaProps {
  onDeleted?: () => void;
}

export default function ProfileDangerArea({ onDeleted }: ProfileDangerAreaProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [password, setPassword] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: deleteAccount,
    isPending,
    error,
  } = useDeleteAccount({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetUsersQueryKey() });
        setIsConfirmOpen(false);
        onDeleted?.();
        await navigate({ to: '/login', search: { redirect: '/' } });
      },
    },
  });
  return (
    <div className="mt-10 rounded-lg border border-red-700/20 bg-red-700/5 p-6">
      <h2 className="text-xs font-semibold tracking-wide text-red-700 uppercase">Danger Zone</h2>
      <p className="mt-1 text-sm text-ink/60">
        Deleting your account is permanent and cannot be undone.
      </p>
      <button
        type="button"
        title="Delete Account"
        aria-label="Delete Account"
        onClick={() => setIsConfirmOpen(true)}
        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border border-red-700/40 px-4 py-2 text-sm font-medium text-red-700 transition-colors duration-150 hover:bg-red-700/10 focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:ring-offset-2 focus:ring-offset-cream"
      >
        <DeleteIcon />
        Delete Account
      </button>
      <DeleteAccountDialog
        open={isConfirmOpen}
        password={password}
        setPassword={setPassword}
        title="Delete your account?"
        description={error ? getApiErrorMessage(error) : 'This action cannot be undone.'}
        confirmLabel="Delete"
        isConfirming={isPending}
        onConfirm={() => deleteAccount({ data: { password } })}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
