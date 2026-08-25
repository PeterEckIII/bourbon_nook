import type { BottleResponseModel } from '../api/generated/bottles-api';
import type { ReviewResponseModel } from '../api/generated/reviews-api';

export interface CountDatum {
  label: string;
  count: number;
}

export interface AvgDatum {
  label: string;
  average: number;
}

export interface HistogramBucket {
  rangeStart: number;
  rangeEnd: number;
  count: number;
}

function countBy<T>(
  items: T[],
  keyFn: (item: T) => string | null | undefined,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

export function groupCounts<T>(
  items: T[],
  keyFn: (item: T) => string | null | undefined,
): CountDatum[] {
  return [...countBy(items, keyFn).entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function bottlesByType(bottles: BottleResponseModel[]): CountDatum[] {
  return groupCounts(bottles, (b) => b.type);
}

const STATUS_ORDER = ['OPENED', 'SEALED', 'FINISHED'] as const;

export function bottlesByStatus(bottles: BottleResponseModel[]): CountDatum[] {
  const counts = countBy(bottles, (b) => b.status);
  return STATUS_ORDER.map((status) => ({ label: status, count: counts.get(status) ?? 0 }));
}

export function topRegions(bottles: BottleResponseModel[], topN: number): CountDatum[] {
  const sorted = groupCounts(bottles, (b) => b.region || b.country);
  if (sorted.length <= topN) return sorted;
  const top = sorted.slice(0, topN);
  const otherCount = sorted.slice(topN).reduce((sum, d) => sum + d.count, 0);
  return [...top, { label: 'Other', count: otherCount }];
}

const PRICE_TIERS = [0, 25, 50, 100, 300] as const;

export function priceDistribution(bottles: BottleResponseModel[]): CountDatum[] {
  const prices = bottles.flatMap((b) => (typeof b.price === 'number' ? [b.price] : []));
  return PRICE_TIERS.map((tierStart, i) => {
    const tierEnd: number | undefined = PRICE_TIERS[i + 1];
    const count = prices.filter(
      (p) => p >= tierStart && (tierEnd === undefined || p < tierEnd),
    ).length;
    const label = tierEnd === undefined ? `$${tierStart}+` : `$${tierStart}–${tierEnd}`;
    return { label, count };
  });
}

/** Rounds a raw step size up to a "nice" 1/2/5-times-a-power-of-ten step (the standard D3 tick-step algorithm). */
function niceStep(rawStep: number): number {
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / magnitude;
  if (residual >= Math.sqrt(50)) return 10 * magnitude;
  if (residual >= Math.sqrt(10)) return 5 * magnitude;
  if (residual >= Math.sqrt(2)) return 2 * magnitude;
  return magnitude;
}

export function histogram(values: number[], bucketCount: number): HistogramBucket[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return [{ rangeStart: min, rangeEnd: max, count: values.length }];
  }
  const step = niceStep((max - min) / bucketCount);
  const start = Math.floor(min / step) * step;
  const buckets: HistogramBucket[] = [];
  for (let rangeStart = start; rangeStart < max; rangeStart += step) {
    buckets.push({ rangeStart, rangeEnd: rangeStart + step, count: 0 });
  }
  for (const value of values) {
    const idx = Math.min(buckets.length - 1, Math.floor((value - start) / step));
    buckets[idx].count += 1;
  }
  return buckets;
}

export function countByMonth<T>(
  items: T[],
  dateFn: (item: T) => string | null | undefined,
): CountDatum[] {
  const counts = countBy(items, (item) => {
    const match = /^(\d{4})-(\d{2})-\d{2}/.exec(dateFn(item) ?? '');
    return match ? `${match[1]}-${match[2]}` : undefined;
  });
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function avgScoreByNoteCategory(reviews: ReviewResponseModel[]): AvgDatum[] {
  const sums = new Map<string, { total: number; count: number }>();
  for (const review of reviews) {
    for (const note of review.reviewNotes ?? []) {
      if (!note.categoryName || note.score === undefined) continue;
      const entry = sums.get(note.categoryName) ?? { total: 0, count: 0 };
      entry.total += note.score;
      entry.count += 1;
      sums.set(note.categoryName, entry);
    }
  }
  return [...sums.entries()]
    .map(([label, { total, count }]) => ({ label, average: total / count }))
    .sort((a, b) => b.average - a.average);
}

export function totalCollectionValue(bottles: BottleResponseModel[]): number {
  return bottles.reduce((sum, b) => sum + (b.price ?? 0), 0);
}

export function averageRating(reviews: ReviewResponseModel[]): number | undefined {
  const rated = reviews.filter(
    (r): r is ReviewResponseModel & { overallRating: number } =>
      typeof r.overallRating === 'number',
  );
  if (rated.length === 0) return undefined;
  return rated.reduce((sum, r) => sum + r.overallRating, 0) / rated.length;
}
