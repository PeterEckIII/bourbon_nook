import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: RouteComponent,
});

const features = [
  {
    title: 'Track your collection',
    description:
      "Catalog every bottle you own, from everyday pours to the ones you're saving for a special occasion.",
  },
  {
    title: 'Write tasting notes',
    description:
      "Capture nose, palate, and finish while it's fresh, and look back on how your palate has changed over time.",
  },
  {
    title: 'Rate and review',
    description:
      "Score bottles, compare notes across your collection, and build a personal log of everything you've tried.",
  },
];

function RouteComponent() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-caprasimo text-3xl text-ink sm:text-4xl">About Bourbon Nook</h1>
        <p className="mx-auto mt-4 max-w-2xl text-ink/70">
          Bourbon Nook is a home for your whiskey collection. It's built for people who want to keep
          track of what they own, remember what they thought of it, and revisit their notes long
          after the bottle is empty.
        </p>
      </div>

      <h2 className="mb-3 text-xs font-semibold tracking-wide text-ink/50 uppercase">
        What you can do
      </h2>
      <ul className="grid gap-4 sm:grid-cols-3" aria-label="Features">
        {features.map((feature) => (
          <li key={feature.title} className="rounded-lg border border-ink/10 bg-cream p-5">
            <h3 className="font-semibold text-ink">{feature.title}</h3>
            <p className="mt-2 text-sm text-ink/70">{feature.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
