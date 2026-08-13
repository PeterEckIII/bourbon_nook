import { useUserBottlesSuspense } from '../../api/generated/bottles-api';
import type { ReviewResponseModel } from '../../api/generated/reviews-api';
import useReviewForm from '../../hooks/useReviewForm';

export default function ReviewForm({
  valuesToEdit,
  reviewId,
}: {
  valuesToEdit?: ReviewResponseModel;
  reviewId?: string;
}) {
  const { data: bottles } = useUserBottlesSuspense();
  const bottleOptions = bottles.map((bottle) => ({
    value: bottle.id!,
    label: bottle.name!,
  }));

  const { form, serverError } = useReviewForm({ valuesToEdit, reviewId });

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
        {serverError && (
          <p role="alert" className="text-sm text-red-700">
            {serverError}
          </p>
        )}

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
              />
            )}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField
              name="reviewDate"
              children={(field) => <field.DateField label="Review Date" />}
            />
            <form.AppField
              name="restTimeMin"
              children={(field) => (
                <field.NumberField label="Rest Time (minutes)" />
              )}
            />
            <form.AppField
              name="glassware"
              children={(field) => (
                <field.TextField
                  label="Glassware"
                  type="text"
                  placeholder="Glencairn, Copita"
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
              />
            )}
          />
          <form.AppField
            name="palate"
            children={(field) => (
              <field.TextareaField
                label="Palate"
                placeholder="Baking spice, vanilla, toasted oak"
              />
            )}
          />
          <form.AppField
            name="finish"
            children={(field) => (
              <field.TextareaField
                label="Finish"
                placeholder="Long, warm, lingering spice"
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
              />
            )}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField
              name="valueScore"
              children={(field) => <field.NumberField label="Value Rating" />}
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
