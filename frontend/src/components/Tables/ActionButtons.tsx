import { Link } from '@tanstack/react-router';
import PlusIcon from '../Icons/PlusIcon';
import EditIcon from '../Icons/EditIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import useBottleDeleteForm from '../../hooks/useBottleDeleteForm';

export default function ActionButtons({ bottleId }: { bottleId: string }) {
  const { form } = useBottleDeleteForm({ bottleId });
  return (
    <div className="flex justify-around">
      <div>
        <button type="button">
          <Link to="/reviews/new" title="Write Review" aria-label="Add Review">
            <PlusIcon />
          </Link>
        </button>
      </div>
      <div>
        <button type="button">
          <Link
            to="/bottles/$bottleId/edit"
            params={{ bottleId }}
            title="Edit Bottle"
            aria-label="Edit Bottle"
          >
            <EditIcon />
          </Link>
        </button>
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField
            name="bottleId"
            children={(field) => (
              <field.TextField type="hidden" label="bottleId" />
            )}
          />
          <button
            type="submit"
            title="Delete Bottle"
            aria-label="Delete Bottle"
          >
            <DeleteIcon />
          </button>
        </form>
      </div>
    </div>
  );
}
