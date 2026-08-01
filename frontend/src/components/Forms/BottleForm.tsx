import { z } from 'zod';
import { useAppForm } from '../../hooks/form';

const bottleSchema = z.object({
  name: z.string(),
  type: z.string(),
  status: z.enum(['OPENED', 'SEALED', 'FINISHED']),
  distillery: z.string(),
  producer: z.string(),
  country: z.string(),
  region: z.string(),
  price: z.number(),
  age: z.string(),
  proof: z.number(),
  releaseYear: z.number(),
  barrelInformation: z.string(),
  finishing: z.string(),
  imageUrl: z.string(),
  openDate: z.iso.date().or(z.literal('')).optional(),
  killDate: z.iso.date().or(z.literal('')).optional(),
});

type Bottle = z.infer<typeof bottleSchema>;

const defaultValues: Bottle = {
  name: '',
  type: '',
  status: 'SEALED',
  distillery: '',
  producer: '',
  country: '',
  region: '',
  price: 0.0,
  age: '',
  proof: 0.0,
  releaseYear: 0,
  barrelInformation: '',
  finishing: '',
  imageUrl: '',
  openDate: '',
  killDate: '',
};

export default function BottleForm() {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: bottleSchema.parse,
    },
    onSubmit: ({ value }) => {
      const payload = {
        ...value,
        openDate: value.openDate || undefined,
        killDate: value.killDate || undefined,
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
      <h1>Bottle Information</h1>
      <form.AppField
        name="name"
        children={(field) => (
          <field.TextField
            label="Bottle Name"
            type="text"
            placeholder="Buffalo Trace"
            required
          />
        )}
      />
      <form.AppField
        name="type"
        children={(field) => (
          <field.TextField
            label="Liquor Type"
            type="text"
            placeholder="Bourbon"
            required
          />
        )}
      />
      <form.AppField
        name="status"
        children={(field) => (
          <field.SelectField
            label="Bottle Status"
            options={[
              { value: 'SEALED', label: 'Sealed' },
              { value: 'OPENED', label: 'Opened' },
              { value: 'FINISHED', label: 'Finished' },
            ]}
            required
          />
        )}
      />
      <form.AppField
        name="distillery"
        children={(field) => (
          <field.TextField
            label="Distillery"
            type="text"
            placeholder="Buffalo Trace, Heaven Hill"
            required
          />
        )}
      />
      <form.AppField
        name="producer"
        children={(field) => (
          <field.TextField
            label="Producer"
            type="text"
            placeholder="Sazerac, MGP"
            required
          />
        )}
      />
      <form.AppField
        name="country"
        children={(field) => (
          <field.TextField
            label="Country of Origin"
            type="text"
            placeholder="USA, Japan, Scotland"
            required
          />
        )}
      />
      <form.AppField
        name="region"
        children={(field) => (
          <field.TextField
            label="Region"
            type="text"
            placeholder="KY, Islay, Hokkaido"
            required
          />
        )}
      />
      <form.AppField
        name="price"
        children={(field) => <field.NumberField label="Price" required />}
      />
      <form.AppField
        name="age"
        children={(field) => (
          <field.TextField
            label="Age"
            type="text"
            placeholder="10yrs, 6yrs 7mos, NAS"
            required
          />
        )}
      />
      <form.AppField
        name="proof"
        children={(field) => <field.NumberField label="Proof" required />}
      />
      <form.AppField
        name="releaseYear"
        children={(field) => (
          <field.NumberField label="Release Year" required />
        )}
      />
      <form.AppField
        name="barrelInformation"
        children={(field) => (
          <field.TextField
            label="Barrel Information"
            type="text"
            placeholder="Binny's Pick, Barrel A225G3"
            required
          />
        )}
      />
      <form.AppField
        name="finishing"
        children={(field) => (
          <field.TextField
            label="Finishing Barrels"
            type="text"
            placeholder="Port, Sauternes, Tequila"
            required
          />
        )}
      />
      {/* Will need to change */}
      <form.AppField
        name="imageUrl"
        children={(field) => (
          <field.TextField label="Image URL" type="url" required />
        )}
      />
      <form.AppField
        name="openDate"
        children={(field) => <field.DateField label="Open Date" />}
      />
      <form.AppField
        name="killDate"
        children={(field) => <field.DateField label="Kill Date" />}
      />

      <form.AppForm>
        <form.SubmitButton label="Save Review" />
      </form.AppForm>
    </form>
  );
}
