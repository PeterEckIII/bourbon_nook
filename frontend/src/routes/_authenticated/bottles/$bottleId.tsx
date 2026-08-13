import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  getUserBottleQueryOptions,
  useUserBottleSuspense,
} from '../../../api/generated/bottles-api';
import ActionButtons from '../../../components/ui/ActionButtons';
import BottleImageUpload from '../../../components/Forms/BottleImageUpload';
import StatusPill from '../../../components/Tables/StatusPill';
import noBottleImage from '../../../assets/brand/png/bottle-cancel-1024.png';

export const Route = createFileRoute('/_authenticated/bottles/$bottleId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getUserBottleQueryOptions(params.bottleId)),
  component: RouteComponent,
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

function formatDate(value: string | undefined): string | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!match) return undefined;
  const [, year, month, day] = match;
  return dateFormatter.format(new Date(Number(year), Number(month) - 1, Number(day)));
}

function formatPrice(value: number | undefined): string | undefined {
  return value === undefined ? undefined : `$${value.toFixed(2)}`;
}

function Detail({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value ?? '—'}</dd>
    </div>
  );
}

function RouteComponent() {
  const { bottleId } = Route.useParams();
  const { data: bottle } = useUserBottleSuspense(bottleId);
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/bottles"
        className="text-sm text-ink/60 transition-colors duration-150 hover:text-ink"
      >
        ← Back to Collection
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          <div className="aspect-3/4 w-full overflow-hidden rounded-lg border border-amber-900/15 bg-cream p-4">
            {bottle.imageUrl ? (
              <img
                src={bottle.imageUrl}
                alt={bottle.name ?? 'Bottle'}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-center text-sm text-ink/40">
                <img
                  src={noBottleImage}
                  alt="No bottle image"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </div>
          <BottleImageUpload bottleId={bottleId} hasImage={!!bottle.imageUrl} />
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {bottle.type && (
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {bottle.type}
                </p>
              )}
              <h1 className="font-caprasimo text-3xl text-ink">{bottle.name}</h1>
              <p className="mt-1 text-sm text-ink/60">
                {[bottle.distillery, bottle.producer].filter(Boolean).join(' · ')}
              </p>
            </div>
            {bottle.status && <StatusPill value={bottle.status} />}
          </div>

          {bottle.price !== undefined && (
            <p className="text-2xl font-semibold text-ink">{formatPrice(bottle.price)}</p>
          )}

          <ActionButtons
            bottleId={bottleId}
            onDeleted={() => navigate({ to: '/bottles' })}
            showLabels
          />

          <div className="space-y-6 border-t border-ink/10 pt-6">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Origin</h2>
              <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Detail label="Distillery" value={bottle.distillery} />
                <Detail label="Producer" value={bottle.producer} />
                <Detail label="Country" value={bottle.country} />
                <Detail label="Region" value={bottle.region} />
              </dl>
            </div>

            <div className="border-t border-ink/10 pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                Specifications
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Detail label="Age" value={bottle.age} />
                <Detail label="Proof" value={bottle.proof} />
                <Detail label="Release Year" value={bottle.releaseYear} />
              </dl>
            </div>

            <div className="border-t border-ink/10 pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                Barrel & Finish
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Detail label="Barrel Information" value={bottle.barrelInformation} />
                <Detail label="Finishing" value={bottle.finishing} />
              </dl>
            </div>

            <div className="border-t border-ink/10 pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                Timeline
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Detail label="Open Date" value={formatDate(bottle.openDate)} />
                <Detail label="Kill Date" value={formatDate(bottle.killDate)} />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
