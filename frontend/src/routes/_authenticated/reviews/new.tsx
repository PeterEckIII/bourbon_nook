import { createFileRoute } from '@tanstack/react-router';
import ReviewForm from '../../../components/Forms/ReviewForm';
import { getUserBottlesQueryOptions } from '../../../api/generated/bottles-api';
import { getCategoriesWithSystemNotesQueryOptions } from '../../../api/generated/reviews-api';
import z from 'zod';

const searchSchema = z.object({
  bottleId: z.string().optional(),
});

export const Route = createFileRoute('/_authenticated/reviews/new')({
  validateSearch: searchSchema,
  search: {
    middlewares: [
      ({ search, next }) => {
        const result = next(search);
        return {
          bottleId: search.bottleId,
          ...result,
        };
      },
    ],
  },
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(getUserBottlesQueryOptions()),
      context.queryClient.ensureQueryData(getCategoriesWithSystemNotesQueryOptions()),
    ]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { bottleId } = Route.useSearch();
  return <ReviewForm bottleId={bottleId} />;
}
