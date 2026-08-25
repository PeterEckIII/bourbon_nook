import { describe, it, expect } from 'vite-plus/test';
import type { BottleResponseModel } from '../api/generated/bottles-api';
import type { ReviewResponseModel } from '../api/generated/reviews-api';
import {
  groupCounts,
  bottlesByType,
  bottlesByStatus,
  topRegions,
  histogram,
  countByMonth,
  avgScoreByNoteCategory,
  totalCollectionValue,
  averageRating,
  priceDistribution,
} from './dashboardStats';

function bottle(overrides: Partial<BottleResponseModel> = {}): BottleResponseModel {
  return { name: 'Bottle', type: 'Bourbon', status: 'OPENED', ...overrides };
}

function review(overrides: Partial<ReviewResponseModel> = {}): ReviewResponseModel {
  return { bottleId: 'b1', ...overrides };
}

describe('groupCounts', () => {
  it('counts items by key, sorted by count descending', () => {
    const items = ['a', 'a', 'b', 'a', 'c', 'b'];
    expect(groupCounts(items, (x) => x)).toEqual([
      { label: 'a', count: 3 },
      { label: 'b', count: 2 },
      { label: 'c', count: 1 },
    ]);
  });

  it('breaks ties alphabetically by label', () => {
    const items = ['b', 'a'];
    expect(groupCounts(items, (x) => x)).toEqual([
      { label: 'a', count: 1 },
      { label: 'b', count: 1 },
    ]);
  });

  it('drops items whose key is null, undefined, or empty', () => {
    const items = ['a', '', undefined, null, 'a'] as (string | null | undefined)[];
    expect(groupCounts(items, (x) => x)).toEqual([{ label: 'a', count: 2 }]);
  });

  it('returns an empty array for no items', () => {
    expect(groupCounts([], (x: string) => x)).toEqual([]);
  });
});

describe('bottlesByType', () => {
  it('groups bottles by type', () => {
    const bottles = [bottle({ type: 'Bourbon' }), bottle({ type: 'Rye' }), bottle({ type: 'Bourbon' })];
    expect(bottlesByType(bottles)).toEqual([
      { label: 'Bourbon', count: 2 },
      { label: 'Rye', count: 1 },
    ]);
  });
});

describe('bottlesByStatus', () => {
  it('always returns all three statuses in a fixed order, including zero counts', () => {
    const bottles = [bottle({ status: 'OPENED' }), bottle({ status: 'OPENED' })];
    expect(bottlesByStatus(bottles)).toEqual([
      { label: 'OPENED', count: 2 },
      { label: 'SEALED', count: 0 },
      { label: 'FINISHED', count: 0 },
    ]);
  });
});

describe('topRegions', () => {
  it('returns all regions when there are fewer than topN', () => {
    const bottles = [bottle({ region: 'KY' }), bottle({ region: 'TN' }), bottle({ region: 'KY' })];
    expect(topRegions(bottles, 6)).toEqual([
      { label: 'KY', count: 2 },
      { label: 'TN', count: 1 },
    ]);
  });

  it('falls back to country when region is missing', () => {
    const bottles = [bottle({ region: undefined, country: 'Ireland' })];
    expect(topRegions(bottles, 6)).toEqual([{ label: 'Ireland', count: 1 }]);
  });

  it('collapses everything past topN into an Other bucket', () => {
    const bottles = ['A', 'B', 'C', 'D'].map((region) => bottle({ region }));
    const result = topRegions(bottles, 2);
    expect(result).toEqual([
      { label: 'A', count: 1 },
      { label: 'B', count: 1 },
      { label: 'Other', count: 2 },
    ]);
  });
});

describe('priceDistribution', () => {
  it('buckets bottles into fixed price tiers with an open-ended top bucket', () => {
    const bottles = [
      bottle({ price: 10 }),
      bottle({ price: 30 }),
      bottle({ price: 75 }),
      bottle({ price: 200 }),
      bottle({ price: 500 }),
    ];
    expect(priceDistribution(bottles)).toEqual([
      { label: '$0–25', count: 1 },
      { label: '$25–50', count: 1 },
      { label: '$50–100', count: 1 },
      { label: '$100–300', count: 1 },
      { label: '$300+', count: 1 },
    ]);
  });

  it('puts a price exactly on a tier boundary into the higher tier', () => {
    const bottles = [bottle({ price: 25 }), bottle({ price: 300 })];
    expect(priceDistribution(bottles)).toEqual([
      { label: '$0–25', count: 0 },
      { label: '$25–50', count: 1 },
      { label: '$50–100', count: 0 },
      { label: '$100–300', count: 0 },
      { label: '$300+', count: 1 },
    ]);
  });

  it('ignores bottles with no price and returns all tiers even when empty', () => {
    expect(priceDistribution([bottle({ price: undefined })])).toEqual([
      { label: '$0–25', count: 0 },
      { label: '$25–50', count: 0 },
      { label: '$50–100', count: 0 },
      { label: '$100–300', count: 0 },
      { label: '$300+', count: 0 },
    ]);
  });
});

describe('histogram', () => {
  it('buckets values into a round, zero-anchored step size', () => {
    const result = histogram([0, 1, 4, 5, 9], 2);
    expect(result).toEqual([
      { rangeStart: 0, rangeEnd: 5, count: 3 },
      { rangeStart: 5, rangeEnd: 10, count: 2 },
    ]);
  });

  it('picks a sensible round step for a wider, price-like range', () => {
    const result = histogram([25.99, 60, 90, 120, 400, 650], 6);
    expect(result.map((b) => [b.rangeStart, b.rangeEnd])).toEqual([
      [0, 100],
      [100, 200],
      [200, 300],
      [300, 400],
      [400, 500],
      [500, 600],
      [600, 700],
    ]);
  });

  it('rounds a 0-10 rating range to steps of 2 rather than fractional steps', () => {
    const result = histogram([0, 3, 6, 9, 10], 6);
    expect(result.map((b) => [b.rangeStart, b.rangeEnd])).toEqual([
      [0, 2],
      [2, 4],
      [4, 6],
      [6, 8],
      [8, 10],
    ]);
  });

  it('anchors buckets to the data range rather than padding from zero when values cluster away from it', () => {
    const result = histogram([7, 9], 6);
    expect(result.map((b) => [b.rangeStart, b.rangeEnd])).toEqual([
      [7, 7.5],
      [7.5, 8],
      [8, 8.5],
      [8.5, 9],
    ]);
  });

  it('puts every value in a single bucket when they are all equal', () => {
    expect(histogram([5, 5, 5], 4)).toEqual([{ rangeStart: 5, rangeEnd: 5, count: 3 }]);
  });

  it('returns an empty array for no values', () => {
    expect(histogram([], 4)).toEqual([]);
  });
});

describe('countByMonth', () => {
  it('groups by year-month and sorts chronologically', () => {
    const items = ['2026-03-05', '2026-01-10', '2026-03-20'];
    expect(countByMonth(items, (x) => x)).toEqual([
      { label: '2026-01', count: 1 },
      { label: '2026-03', count: 2 },
    ]);
  });

  it('drops items with a missing or malformed date', () => {
    const items = ['2026-01-10', undefined, 'not-a-date'];
    expect(countByMonth(items, (x) => x)).toEqual([{ label: '2026-01', count: 1 }]);
  });

  it('groups a full ISO timestamp by its date prefix', () => {
    const items = ['2026-08-08T19:32:57.530433', '2026-08-06T11:15:32.757152'];
    expect(countByMonth(items, (x) => x)).toEqual([{ label: '2026-08', count: 2 }]);
  });
});

describe('avgScoreByNoteCategory', () => {
  it('averages note scores per category across reviews, sorted descending', () => {
    const reviews = [
      review({
        reviewNotes: [
          { categoryName: 'Vanilla', score: 8 },
          { categoryName: 'Oak', score: 4 },
        ],
      }),
      review({
        reviewNotes: [
          { categoryName: 'Vanilla', score: 6 },
          { categoryName: 'Oak', score: 6 },
        ],
      }),
    ];
    expect(avgScoreByNoteCategory(reviews)).toEqual([
      { label: 'Vanilla', average: 7 },
      { label: 'Oak', average: 5 },
    ]);
  });

  it('ignores reviews with no notes', () => {
    expect(avgScoreByNoteCategory([review({ reviewNotes: undefined })])).toEqual([]);
  });
});

describe('totalCollectionValue', () => {
  it('sums the price of every bottle, treating missing price as 0', () => {
    const bottles = [bottle({ price: 25.5 }), bottle({ price: undefined }), bottle({ price: 74.5 })];
    expect(totalCollectionValue(bottles)).toBe(100);
  });
});

describe('averageRating', () => {
  it('averages overallRating across reviews that have one', () => {
    const reviews = [review({ overallRating: 8 }), review({ overallRating: 6 })];
    expect(averageRating(reviews)).toBe(7);
  });

  it('returns undefined when no reviews have a rating', () => {
    expect(averageRating([review({ overallRating: undefined })])).toBe(undefined);
  });
});
