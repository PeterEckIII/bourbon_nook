import { Link } from '@tanstack/react-router';

export default function ActionButtons({ bottleId }: { bottleId: string }) {
  return (
    <div className="flex justify-around">
      <div>
        <button type="button">
          <Link to="/reviews/new">Review</Link>
        </button>
      </div>
      <div>
        <button type="button">
          <Link to="/bottles/$bottleId/edit" params={{ bottleId }}>
            Edit
          </Link>
        </button>
      </div>
      <div>
        <form action={`/bottles/${bottleId}`} method="DELETE">
          <button type="submit">Delete</button>
        </form>
      </div>
    </div>
  );
}
