import { type BottleResponseModel } from '../../api/generated/bottles-api';
import useBottleForm from '../../hooks/useBottleForm';

export default function BottleForm({
  valuesToEdit,
  bottleId,
}: {
  valuesToEdit?: BottleResponseModel;
  bottleId?: string;
}) {
  const { form, serverError } = useBottleForm({ valuesToEdit, bottleId });

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <form
        className="mx-auto w-full max-w-3xl space-y-8 rounded-lg border border-ink/15 bg-cream p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h1 className="font-caprasimo text-2xl text-center">Bottle Information</h1>
        {serverError && (
          <p role="alert" className="text-sm text-red-700">
            {serverError}
          </p>
        )}

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Basics</h2>
          {bottleId && (
            <>
              <form.AppField
                name="bottleId"
                children={(field) => <field.TextField type="hidden" label="BottleId" />}
              />
              <form.AppField
                name="mode"
                children={(field) => <field.TextField type="hidden" label="Mode" />}
              />
            </>
          )}
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField label="Bottle Name" type="text" placeholder="Buffalo Trace" />
            )}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField
              name="type"
              children={(field) => (
                <field.TextField label="Liquor Type" type="text" placeholder="Bourbon" />
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
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Origin</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField
              name="distillery"
              children={(field) => (
                <field.TextField
                  label="Distillery"
                  type="text"
                  placeholder="Buffalo Trace, Heaven Hill"
                />
              )}
            />
            <form.AppField
              name="producer"
              children={(field) => (
                <field.TextField label="Producer" type="text" placeholder="Sazerac, MGP" />
              )}
            />
            <form.AppField
              name="country"
              children={(field) => (
                <field.TextField
                  label="Country of Origin"
                  type="text"
                  placeholder="USA, Japan, Scotland"
                />
              )}
            />
            <form.AppField
              name="region"
              children={(field) => (
                <field.TextField label="Region" type="text" placeholder="KY, Islay, Hokkaido" />
              )}
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Specifications
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="price" children={(field) => <field.NumberField label="Price" />} />
            <form.AppField
              name="age"
              children={(field) => (
                <field.TextField label="Age" type="text" placeholder="10yrs, 6yrs 7mos, NAS" />
              )}
            />
            <form.AppField name="proof" children={(field) => <field.NumberField label="Proof" />} />
            <form.AppField
              name="releaseYear"
              children={(field) => <field.NumberField label="Release Year" />}
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
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Timeline</h2>
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
