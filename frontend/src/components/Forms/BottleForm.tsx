import { z } from 'zod';
import { useAppForm } from '../../hooks/form';

const bottleSchema = z.object({
  name: z.string('Name is required'),
  type: z.string('Type is required'),
  status: z.enum(['OPENED', 'SEALED', 'FINISHED'], 'Status is required'),
  distillery: z.string().optional(),
  producer: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  price: z.number().optional(),
  age: z.string().optional(),
  proof: z.number().optional(),
  releaseYear: z.number().optional(),
  barrelInformation: z.string().optional(),
  finishing: z.string().optional(),
  imageUrl: z.string().optional(),
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
      onChange: bottleSchema,
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
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <form
        className="mx-auto w-full max-w-3xl space-y-8 rounded-lg border border-ink/15 bg-cream p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h1 className="font-caprasimo text-2xl text-center">
          Bottle Information
        </h1>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Basics
          </h2>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Origin
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Specifications
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Barrel &amp; Finish
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Extras
          </h2>
          {/* Will need to change */}
          <form.AppField
            name="imageUrl"
            children={(field) => (
              <field.TextField label="Image URL" type="url" required />
            )}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField
              name="openDate"
              children={(field) => <field.DateField label="Open Date" />}
            />
            <form.AppField
              name="killDate"
              children={(field) => <field.DateField label="Kill Date" />}
            />
          </div>
        </div>

        <form.AppForm>
          <form.SubmitButton label="Save Bottle" fullWidth />
        </form.AppForm>
      </form>
    </div>
  );
}
