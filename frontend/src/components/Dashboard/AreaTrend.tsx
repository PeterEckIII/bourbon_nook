import { useId } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const tickStyle = { fill: 'var(--color-ink)', fillOpacity: 0.6, fontSize: 12 };

export interface TrendDatum {
  label: string;
  value: number;
}

export default function AreaTrend({ data, height = 200 }: { data: TrendDatum[]; height?: number }) {
  const gradientId = useId();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-amber-600)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-amber-600)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--color-ink)" strokeOpacity={0.08} vertical={false} />
        <XAxis dataKey="label" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={tickStyle} axisLine={false} tickLine={false} width={32} />
        <Tooltip
          contentStyle={{
            background: 'var(--color-cream)',
            border: '1px solid color-mix(in srgb, var(--color-ink) 15%, transparent)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--color-ink)',
          }}
          labelStyle={{ color: 'var(--color-ink)', fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-amber-600)"
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: 'var(--color-amber-600)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
