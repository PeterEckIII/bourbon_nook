import { createFileRoute } from '@tanstack/react-router';
import BottleForm from '../../../components/Forms/BottleForm';

export const Route = createFileRoute('/_authenticated/bottles/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <BottleForm />;
}
