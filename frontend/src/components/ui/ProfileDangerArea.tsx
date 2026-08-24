import { useState } from 'react';
import { getApiErrorMessage } from '../../api/errors';
import { getGetUsersQueryKey, useDeleteAccount } from '../../api/generated/users-api';
import DeleteIcon from '../Icons/DeleteIcon';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import DeleteAccountDialog from './DeleteAccountDialog';
import { buttonClasses } from './buttonClasses';

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
        className={`mt-4 ${buttonClasses({ variant: 'dangerOutline' })}`}
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
