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
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit();
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
              <form.AppField name="bottleId">
                {(field) => <field.TextField type="hidden" label="BottleId" />}
              </form.AppField>
              <form.AppField name="mode">
                {(field) => <field.TextField type="hidden" label="Mode" />}
              </form.AppField>
            </>
          )}
          <form.AppField name="name">
            {(field) => (
              <field.TextField label="Bottle Name" type="text" placeholder="Buffalo Trace" />
            )}
          </form.AppField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="type">
              {(field) => <field.TextField label="Liquor Type" type="text" placeholder="Bourbon" />}
            </form.AppField>
            <form.AppField name="status">
              {(field) => (
                <field.SelectField
                  label="Bottle Status"
                  options={[
                    { value: 'SEALED', label: 'Sealed' },
                    { value: 'OPENED', label: 'Opened' },
                    { value: 'FINISHED', label: 'Finished' },
                  ]}
                />
              )}
            </form.AppField>
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Origin</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="distillery">
              {(field) => (
                <field.TextField
                  label="Distillery"
                  type="text"
                  placeholder="Buffalo Trace, Heaven Hill"
                />
              )}
            </form.AppField>
            <form.AppField name="producer">
              {(field) => (
                <field.TextField label="Producer" type="text" placeholder="Sazerac, MGP" />
              )}
            </form.AppField>
            <form.AppField name="country">
              {(field) => (
                <field.TextField
                  label="Country of Origin"
                  type="text"
                  placeholder="USA, Japan, Scotland"
                />
              )}
            </form.AppField>
            <form.AppField name="region">
              {(field) => (
                <field.TextField label="Region" type="text" placeholder="KY, Islay, Hokkaido" />
              )}
            </form.AppField>
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Specifications
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="price">
              {(field) => <field.NumberField label="Price" />}
            </form.AppField>
            <form.AppField name="age">
              {(field) => (
                <field.TextField label="Age" type="text" placeholder="10yrs, 6yrs 7mos, NAS" />
              )}
            </form.AppField>
            <form.AppField name="proof">
              {(field) => <field.NumberField label="Proof" />}
            </form.AppField>
            <form.AppField name="releaseYear">
              {(field) => <field.NumberField label="Release Year" />}
            </form.AppField>
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Barrel &amp; Finish
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="barrelInformation">
              {(field) => (
                <field.TextField
                  label="Barrel Information"
                  type="text"
                  placeholder="Binny's Pick, Barrel A225G3"
                />
              )}
            </form.AppField>
            <form.AppField name="finishing">
              {(field) => (
                <field.TextField
                  label="Finishing Barrels"
                  type="text"
                  placeholder="Port, Sauternes, Tequila"
                />
              )}
            </form.AppField>
          </div>
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Timeline</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="openDate">
              {(field) => <field.DateField label="Open Date" />}
            </form.AppField>
            <form.AppField name="killDate">
              {(field) => <field.DateField label="Kill Date" />}
            </form.AppField>
          </div>
        </div>
        <form.AppForm>
          <form.SubmitButton label="Save Bottle" fullWidth />
        </form.AppForm>
      </form>
    </div>
  );
}
