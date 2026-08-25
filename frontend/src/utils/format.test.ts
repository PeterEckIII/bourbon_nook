import { describe, it, expect } from 'vite-plus/test';
import { formatPrice, formatDate, formatMonthYear } from './format';

describe('Format price', () => {
  it('correctly formats a number with no comma', () => {
    const result = formatPrice(100);
    expect(result).toBe('$100.00');
  });
  it('correctly formats a number with one comma', () => {
    const result = formatPrice(1000);
    expect(result).toBe('$1,000.00');
  });
  it('correctly formats a number with multiple commas', () => {
    const result = formatPrice(1000000);
    expect(result).toBe('$1,000,000.00');
  });
  it('correctly formats a negative number', () => {
    const result = formatPrice(-1000);
    expect(result).toBe('$-1,000.00');
  });
  it('correctly formats a number with decimals', () => {
    const result = formatPrice(1234.5);
    expect(result).toBe('$1,234.50');
  });
  it('correctly formats a negative number with decimals', () => {
    const result = formatPrice(-155.5);
    expect(result).toBe('$-155.50');
  });
  it('correctly formats 0', () => {
    const result = formatPrice(0);
    expect(result).toBe('$0.00');
  });
  it('correctly rounds the number per .toFixed()', () => {
    const result = formatPrice(123.9999);
    expect(result).toBe('$124.00');
  });
});

describe('Format date', () => {
  it('formats the date from a string', () => {
    const result = formatDate('2026-01-05');
    expect(result).toBe('Jan 5, 2026');
  });
  it('returns undefined if undefined is given', () => {
    const result = formatDate(undefined);
    expect(result).toBe(undefined);
  });
  it('returns undefined if a malformed string is given', () => {
    const result = formatDate('a-string');
    expect(result).toBe(undefined);
  });
  it('returns undefined if a string with a time component is given', () => {
    const result = formatDate('2026-01-05T12:00:00');
    expect(result).toBe(undefined);
  });
  it('formats the date with a two-digit month', () => {
    const result = formatDate('2026-12-25');
    expect(result).toBe('Dec 25, 2026');
  });
  it('formats the date for a leap-day', () => {
    const result = formatDate('2024-02-29');
    expect(result).toBe('Feb 29, 2024');
  });
});

describe('Format month/year', () => {
  it('formats a year-month string', () => {
    expect(formatMonthYear('2026-03')).toBe('Mar 2026');
  });
  it('formats December correctly', () => {
    expect(formatMonthYear('2025-12')).toBe('Dec 2025');
  });
  it('returns the raw value when malformed', () => {
    expect(formatMonthYear('not-a-month')).toBe('not-a-month');
  });
});
