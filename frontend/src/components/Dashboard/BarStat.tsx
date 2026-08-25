import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const tickStyle = { fill: 'var(--color-ink)', fillOpacity: 0.6, fontSize: 12 };
const tooltipContentStyle = {
  background: 'var(--color-cream)',
  border: '1px solid color-mix(in srgb, var(--color-ink) 15%, transparent)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--color-ink)',
};

export interface BarDatum {
  label: string;
  value: number;
}

export default function BarStat({
  data,
  layout = 'horizontal',
  valueFormatter = (value: number) => String(value),
  height = 220,
}: {
  data: BarDatum[];
  layout?: 'horizontal' | 'vertical';
  valueFormatter?: (value: number) => string;
  height?: number;
}) {
  const bars =
    layout === 'vertical' ? (
      <>
        <XAxis
          type="number"
          tick={tickStyle}
          tickFormatter={valueFormatter}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={tickStyle}
          width={90}
          axisLine={false}
          tickLine={false}
        />
      </>
    ) : (
      <>
        <XAxis
          type="category"
          dataKey="label"
          tick={tickStyle}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          type="number"
          tick={tickStyle}
          tickFormatter={valueFormatter}
          axisLine={false}
          tickLine={false}
          width={36}
          allowDecimals={false}
        />
      </>
    );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={layout} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid
          stroke="var(--color-ink)"
          strokeOpacity={0.08}
          horizontal={layout === 'vertical'}
          vertical={layout === 'horizontal'}
        />
        {bars}
        <Tooltip
          cursor={{ fill: 'var(--color-ink)', fillOpacity: 0.06 }}
          formatter={(value) => valueFormatter(Number(value))}
          contentStyle={tooltipContentStyle}
          labelStyle={{ color: 'var(--color-ink)', fontWeight: 600 }}
        />
        <Bar
          dataKey="value"
          fill="var(--color-amber-600)"
          radius={layout === 'vertical' ? [0, 4, 4, 0] : [4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
