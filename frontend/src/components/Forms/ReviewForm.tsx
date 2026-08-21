import { useUserBottlesSuspense } from '../../api/generated/bottles-api';
import type { ReviewResponseModel } from '../../api/generated/reviews-api';
import useReviewForm from '../../hooks/useReviewForm';

interface ReviewFormProps {
  valuesToEdit?: ReviewResponseModel;
  reviewId?: string;
  bottleId?: string;
}

export default function ReviewForm({ valuesToEdit, reviewId, bottleId }: ReviewFormProps) {
  const { data: bottles } = useUserBottlesSuspense();
  const bottleOptions = bottles.map((bottle) => ({
    value: bottle.id!,
    label: bottle.name!,
  }));

  const { form, serverError } = useReviewForm({ valuesToEdit, reviewId, bottleId });

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <form
        className="mx-auto w-full max-w-3xl space-y-8 rounded-lg border border-ink/15 bg-cream p-6 sm:p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit();
        }}
      >
        <h1 className="font-caprasimo text-2xl text-center">Review Information</h1>
        {serverError && (
          <p role="alert" className="text-sm text-red-700">
            {serverError}
          </p>
        )}

        {reviewId && (
          <>
            <form.AppField name="reviewId">
              {(field) => <field.TextField type="hidden" label="ReviewId" />}
            </form.AppField>
            <form.AppField name="mode">
              {(field) => <field.TextField type="hidden" label="Mode" />}
            </form.AppField>
          </>
        )}

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Session</h2>
          <form.AppField name="bottleId">
            {(field) => (
              <field.ComboboxField
                label="Bottle"
                options={bottleOptions}
                placeholder="Search your bottles"
                emptyMessage="No bottles match"
              />
            )}
          </form.AppField>
          <form.AppField name="setting">
            {(field) => (
              <field.TextField
                label="Review Setting"
                type="text"
                placeholder="Winding down after work"
              />
            )}
          </form.AppField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="reviewDate">
              {(field) => <field.DateField label="Review Date" />}
            </form.AppField>
            <form.AppField name="restTimeMin">
              {(field) => <field.NumberField label="Rest Time (minutes)" />}
            </form.AppField>
            <form.AppField name="glassware">
              {(field) => (
                <field.TextField label="Glassware" type="text" placeholder="Glencairn, Copita" />
              )}
            </form.AppField>
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Tasting Notes
          </h2>
          <form.AppField name="nose">
            {(field) => (
              <field.TextareaField label="Nose" placeholder="Caramel, oak, dark cherry" />
            )}
          </form.AppField>
          <form.AppField name="palate">
            {(field) => (
              <field.TextareaField
                label="Palate"
                placeholder="Baking spice, vanilla, toasted oak"
              />
            )}
          </form.AppField>
          <form.AppField name="finish">
            {(field) => (
              <field.TextareaField label="Finish" placeholder="Long, warm, lingering spice" />
            )}
          </form.AppField>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Overall</h2>
          <form.AppField name="thoughts">
            {(field) => (
              <field.TextareaField
                label="Thoughts"
                placeholder="Overall impressions of this pour"
              />
            )}
          </form.AppField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="valueScore">
              {(field) => <field.NumberField label="Value Rating" />}
            </form.AppField>
            <form.AppField name="overallRating">
              {(field) => <field.NumberField label="Overall Rating" required />}
            </form.AppField>
          </div>
        </div>

        <form.AppForm>
          <form.SubmitButton label="Save Review" fullWidth />
        </form.AppForm>
      </form>
    </div>
  );
}
