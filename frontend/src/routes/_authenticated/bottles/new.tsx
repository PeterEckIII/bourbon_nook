import { createFileRoute, Link } from '@tanstack/react-router';
import BottleForm from '../../../components/Forms/BottleForm';

export const Route = createFileRoute('/_authenticated/bottles/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <Link
          to="/bottles"
          className="text-sm text-ink/60 transition-colors duration-150 hover:text-ink"
        >
          ← Back to Collection
        </Link>
      </div>
      <BottleForm />
    </>
  );
}
