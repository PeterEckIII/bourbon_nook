import { createFileRoute, Link } from '@tanstack/react-router';
import { getReviewQueryOptions, useReviewSuspense } from '../../../api/generated/reviews-api';
import {
  getUserBottleQueryOptions,
  useUserBottleSuspense,
} from '../../../api/generated/bottles-api';
import EditIcon from '../../../components/Icons/EditIcon';
import noBottleImage from '../../../assets/brand/png/bottle-cancel-1024.png';
import { formatDate } from '../../../utils/format';
import { buttonClasses } from '../../../components/ui/buttonClasses';

const editLinkClasses = buttonClasses({ variant: 'secondary', ringOffset: 'ground' });

export const Route = createFileRoute('/_authenticated/reviews/$reviewId')({
  loader: async ({ context, params }) => {
    const review = await context.queryClient.ensureQueryData(
      getReviewQueryOptions(params.reviewId),
    );
    await context.queryClient.ensureQueryData(getUserBottleQueryOptions(review.bottleId!));
  },
  component: RouteComponent,
});

function Detail({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-ink">{value ?? '—'}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-lg border border-terracotta/25 bg-terracotta/10 px-4 py-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-pour">{value ?? '—'}</dd>
    </div>
  );
}

function RouteComponent() {
  const { reviewId } = Route.useParams();
  const { data: review } = useReviewSuspense(reviewId);
  const { data: bottle } = useUserBottleSuspense(review.bottleId!);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/reviews"
        className="text-sm text-ink/60 transition-colors duration-150 hover:text-ink"
      >
        ← Back to Reviews
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <div className="animate-reveal-1 space-y-3">
          <div className="aspect-3/4 w-full overflow-hidden rounded-lg border border-amber-900/15 bg-cream p-4">
            <img
              src={bottle.imageUrl || noBottleImage}
              alt={bottle.name ?? 'Bottle'}
              className="h-full w-full object-contain"
            />
          </div>
          <Link
            to="/bottles/$bottleId"
            params={{ bottleId: bottle.id! }}
            className="text-sm text-ink/60 transition-colors duration-150 hover:text-ink"
          >
            View bottle →
          </Link>
        </div>

        <div className="space-y-6">
          <div className="animate-reveal-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Review</p>
              <h1 className="font-caprasimo text-3xl text-ink">{bottle.name}</h1>
              <p className="mt-1 text-sm text-ink/60">
                {[bottle.distillery, bottle.producer].filter(Boolean).join(' · ')}
              </p>
            </div>
            <Link
              to="/reviews/$reviewId/edit"
              params={{ reviewId }}
              title="Edit Review"
              aria-label="Edit Review"
              className={editLinkClasses}
            >
              <EditIcon />
              Edit Review
            </Link>
          </div>

          <div className="animate-reveal-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Overall Rating" value={review.overallRating} />
            <Stat label="Value Score" value={review.valueScore} />
          </div>

          {review.thoughts && (
            <div className="animate-reveal-3 border-t border-ink/10 pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                Thoughts
              </h2>
              <p className="mt-3 text-sm text-ink">{review.thoughts}</p>
            </div>
          )}

          <div className="animate-reveal-3 border-t border-ink/10 pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              Tasting Notes
            </h2>
            <dl className="mt-3 space-y-4">
              <Detail label="Nose" value={review.nose} />
              <Detail label="Palate" value={review.palate} />
              <Detail label="Finish" value={review.finish} />
            </dl>
          </div>

          <div className="animate-reveal-3 border-t border-ink/10 pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Details</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Detail label="Review Date" value={formatDate(review.reviewDate)} />
              <Detail label="Setting" value={review.setting} />
              <Detail label="Glassware" value={review.glassware} />
              <Detail label="Rest Time (min)" value={review.restTimeMin} />
            </dl>
          </div>

          {review.reviewNotes && review.reviewNotes.length > 0 && (
            <div className="animate-reveal-3 border-t border-ink/10 pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Notes</h2>
              <ul className="mt-3 divide-y divide-amber-900/10 rounded-lg border border-amber-900/15 bg-amber-600/5">
                {review.reviewNotes.map((note) => (
                  <li
                    key={note.noteId}
                    className="flex items-center justify-between px-4 py-3 text-sm text-ink"
                  >
                    <span>
                      {note.categoryName
                        ? `${note.categoryName} — ${note.noteName}`
                        : note.noteName}
                    </span>
                    {note.score !== undefined && (
                      <span className="font-semibold text-pour">{note.score}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
