export default function StatusPill({ value }: { value: unknown }) {
  const opened = typeof value === 'string' && value === 'OPENED';
  const sealed = typeof value === 'string' && value === 'SEALED';
  const finished = typeof value === 'string' && value === 'FINISHED';
  return (
    <div
      className={
        opened
          ? 'bg-amber-200 text-amber-800 py-2 px-4 rounded-lg text-center opacity-75'
          : sealed
            ? 'bg-green-800 text-green-50 py-2 px-4 rounded-lg text-center opacity-75'
            : finished
              ? 'bg-gray-400 text-gray-700 py-2 px-4 rounded-lg text-center opacity-75'
              : ''
      }
    >
      {value as string}
    </div>
  );
}
