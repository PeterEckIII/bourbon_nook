import type { UserResponseModel } from "../../api/generated/users-api";
import useUsersTable from "../../hooks/useUsersTable";
import TBody from "./shared/TBody";
import THead from "./shared/THead";

export default function UserTable({
  data,
  className = ''
}: {
  data: UserResponseModel[];
  className?: string;
}) {
  const { table } = useUsersTable({ data });

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-amber-900/15 bg-cream px-4 py-12 text-center text-sm text-ink/60">
        No users
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-amber-900/15 bg-cream ${className}`}>
      <table className="w-full min-w-max border-collapse text-left">
        <THead table={table} />
        <TBody table={table} />
      </table>
    </div>
  )
}
