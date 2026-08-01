import { z } from 'zod';
import { useAppForm } from '../../hooks/form';

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
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: reviewSchema.parse,
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <h1>Review Information</h1>
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
      <form.AppField
        name="reviewDate"
        children={(field) => <field.DateField label="Review Date" required />}
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
      <form.AppForm>
        <form.SubmitButton label="Save Review" />
      </form.AppForm>
    </form>
  );
}
