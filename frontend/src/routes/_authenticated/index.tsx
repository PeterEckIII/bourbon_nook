import { createFileRoute, Link } from '@tanstack/react-router';
import {
  getUserBottlesQueryOptions,
  useUserBottlesSuspense,
} from '../../api/generated/bottles-api';
import {
  getUserReviewsQueryOptions,
  useUserReviewsSuspense,
} from '../../api/generated/reviews-api';
import StatTile from '../../components/Dashboard/StatTile';
import ChartCard from '../../components/Dashboard/ChartCard';
import BarStat from '../../components/Dashboard/BarStat';
import AreaTrend from '../../components/Dashboard/AreaTrend';
import { formatPrice, formatMonthYear } from '../../utils/format';
import {
  bottlesByType,
  bottlesByStatus,
  topRegions,
  priceDistribution,
  histogram,
  countByMonth,
  avgScoreByNoteCategory,
  totalCollectionValue,
  averageRating,
} from '../../utils/dashboardStats';

export const Route = createFileRoute('/_authenticated/')({
  loader: ({ context }) => {
    return (
      context.queryClient.ensureQueryData(getUserBottlesQueryOptions()),
      context.queryClient.ensureQueryData(getUserReviewsQueryOptions())
    );
  },
  component: RouteComponent,
});

function formatCount(value: number) {
  return String(Math.round(value));
}

function formatBucketBound(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function RouteComponent() {
  const { data: bottles } = useUserBottlesSuspense();
  const { data: reviews } = useUserReviewsSuspense();

  const priceBuckets = priceDistribution(bottles).map((d) => ({ label: d.label, value: d.count }));

  const ratingBuckets = histogram(
    reviews.flatMap((r) => (typeof r.overallRating === 'number' ? [r.overallRating] : [])),
    6,
  ).map((bucket) => ({
    label: `${formatBucketBound(bucket.rangeStart)}–${formatBucketBound(bucket.rangeEnd)}`,
    value: bucket.count,
  }));

  const bottlesAddedByMonth = countByMonth(bottles, (b) => b.createdAt).map((d) => ({
    label: formatMonthYear(d.label),
    value: d.count,
  }));

  const reviewsWrittenByMonth = countByMonth(reviews, (r) => r.reviewDate).map((d) => ({
    label: formatMonthYear(d.label),
    value: d.count,
  }));

  const avgRating = averageRating(reviews);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="animate-reveal-1 mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
      </div>

      <div className="animate-reveal-1 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Bottles" value={formatCount(bottles.length)} />
        <StatTile label="Collection Value" value={formatPrice(totalCollectionValue(bottles))} />
        <StatTile label="Total Reviews" value={formatCount(reviews.length)} />
        <StatTile label="Avg Rating" value={avgRating === undefined ? '—' : avgRating.toFixed(1)} />
      </div>

      <div className="mt-10 mb-3 flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold tracking-wide text-ink/50 uppercase">Collection</h2>
        <Link
          to="/bottles"
          className="text-sm text-ink/60 transition-colors duration-150 hover:text-ink"
        >
          View all bottles →
        </Link>
      </div>
      <div className="animate-reveal-2 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <ChartCard title="Bottles by Type" isEmpty={bottles.length === 0}>
          <BarStat data={bottlesByType(bottles).map((d) => ({ label: d.label, value: d.count }))} />
        </ChartCard>
        <ChartCard title="Bottles by Status" isEmpty={bottles.length === 0}>
          <BarStat
            data={bottlesByStatus(bottles).map((d) => ({ label: d.label, value: d.count }))}
          />
        </ChartCard>
        <ChartCard title="Top Regions" isEmpty={bottles.length === 0}>
          <BarStat
            layout="vertical"
            data={topRegions(bottles, 6).map((d) => ({ label: d.label, value: d.count }))}
          />
        </ChartCard>
      </div>

      <h2 className="mt-10 mb-3 text-xs font-semibold tracking-wide text-ink/50 uppercase">
        Financial &amp; Growth
      </h2>
      <div className="animate-reveal-2 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ChartCard title="Price Distribution" isEmpty={priceBuckets.every((b) => b.value === 0)}>
          <BarStat data={priceBuckets} />
        </ChartCard>
        <ChartCard title="Bottles Added Over Time" isEmpty={bottlesAddedByMonth.length === 0}>
          <AreaTrend data={bottlesAddedByMonth} />
        </ChartCard>
      </div>

      <div className="mt-10 mb-3 flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold tracking-wide text-ink/50 uppercase">Reviews</h2>
        <Link
          to="/reviews"
          className="text-sm text-ink/60 transition-colors duration-150 hover:text-ink"
        >
          View all reviews →
        </Link>
      </div>
      <div className="animate-reveal-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <ChartCard title="Rating Distribution" isEmpty={ratingBuckets.every((b) => b.value === 0)}>
          <BarStat data={ratingBuckets} />
        </ChartCard>
        <ChartCard title="Flavor Profile" isEmpty={reviews.length === 0}>
          <BarStat
            layout="vertical"
            valueFormatter={(v) => v.toFixed(1)}
            data={avgScoreByNoteCategory(reviews).map((d) => ({ label: d.label, value: d.average }))}
          />
        </ChartCard>
        <ChartCard title="Reviews Written Over Time" isEmpty={reviewsWrittenByMonth.length === 0}>
          <AreaTrend data={reviewsWrittenByMonth} />
        </ChartCard>
      </div>
    </div>
  );
}
