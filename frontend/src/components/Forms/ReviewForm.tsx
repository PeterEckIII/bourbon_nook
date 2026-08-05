import { z } from 'zod';
import { useAppForm } from '../../hooks/form';
import { useUserBottlesSuspense } from '../../api/generated/bottles-api';

const reviewSchema = z.object({
  bottleId: z.string(),
  setting: z.string(),
  reviewDate: z.iso.date().or(z.literal('')).optional(),
  restTimeMin: z.number(),
  glassware: z.string(),
  nose: z.string(),
  palate: z.string(),
  finish: z.string(),
  thoughts: z.string(),
  valueScore: z.number().min(0).max(10),
  overallRating: z.number().min(0).max(10),
});

type Review = z.infer<typeof reviewSchema>;

const defaultValues: Review = {
  bottleId: '',
  setting: '',
  reviewDate: '',
  restTimeMin: 0,
  glassware: '',
  nose: '',
  palate: '',
  finish: '',
  thoughts: '',
  valueScore: 0,
  overallRating: 0,
};

export default function ReviewForm() {
  const { data: bottles } = useUserBottlesSuspense();
  const bottleOptions = bottles.map((bottle) => ({
    value: bottle.id!,
    label: bottle.name!,
  }));

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: reviewSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        ...value,
        reviewDate: value.reviewDate || undefined,
      };
      alert(JSON.stringify(payload, null, 2));
    },
  });

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <form
        className="mx-auto w-full max-w-3xl space-y-8 rounded-lg border border-ink/15 bg-cream p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h1 className="font-caprasimo text-2xl text-center">
          Review Information
        </h1>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Session
          </h2>
          <form.AppField
            name="bottleId"
            children={(field) => (
              <field.ComboboxField
                label="Bottle"
                options={bottleOptions}
                placeholder="Search your bottles"
                emptyMessage="No bottles match"
                required
              />
            )}
          />
          <form.AppField
            name="setting"
            children={(field) => (
              <field.TextField
                label="Review Setting"
                type="text"
                placeholder="Winding down after work"
                required
              />
            )}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField
              name="reviewDate"
              children={(field) => (
                <field.DateField label="Review Date" required />
              )}
            />
            <form.AppField
              name="restTimeMin"
              children={(field) => (
                <field.NumberField label="Rest Time (minutes)" required />
              )}
            />
            <form.AppField
              name="glassware"
              children={(field) => (
                <field.TextField
                  label="Glassware"
                  type="text"
                  placeholder="Glencairn, Copita"
                  required
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Tasting Notes
          </h2>
          <form.AppField
            name="nose"
            children={(field) => (
              <field.TextareaField
                label="Nose"
                placeholder="Caramel, oak, dark cherry"
                required
              />
            )}
          />
          <form.AppField
            name="palate"
            children={(field) => (
              <field.TextareaField
                label="Palate"
                placeholder="Baking spice, vanilla, toasted oak"
                required
              />
            )}
          />
          <form.AppField
            name="finish"
            children={(field) => (
              <field.TextareaField
                label="Finish"
                placeholder="Long, warm, lingering spice"
                required
              />
            )}
          />
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Overall
          </h2>
          <form.AppField
            name="thoughts"
            children={(field) => (
              <field.TextareaField
                label="Thoughts"
                placeholder="Overall impressions of this pour"
                required
              />
            )}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField
              name="valueScore"
              children={(field) => (
                <field.NumberField label="Value Rating" required />
              )}
            />
            <form.AppField
              name="overallRating"
              children={(field) => (
                <field.NumberField label="Overall Rating" required />
              )}
            />
          </div>
        </div>

        <form.AppForm>
          <form.SubmitButton label="Save Review" fullWidth />
        </form.AppForm>
      </form>
    </div>
  );
}
