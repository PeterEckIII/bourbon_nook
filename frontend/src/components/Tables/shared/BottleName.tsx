import { Link } from '@tanstack/react-router';
import LinkIcon from '../../Icons/LinkIcon';

type BottleNameProps =
  | { name: string; bottleId: string; reviewId?: undefined }
  | { name: string; bottleId: string; reviewId: string };

export default function BottleName({ name, bottleId, reviewId }: BottleNameProps) {
  return (
    <div className="flex justify-between">
      <div>{name} </div>
      <div>
        <button type="button" className="align-middle">
          {reviewId ? (
            <Link
              to="/reviews/$reviewId"
              params={{ reviewId }}
              title="View Review"
              aria-label="View Review"
              className="cursor-pointer"
            >
              <LinkIcon />
            </Link>
          ) : (
            <Link
              to="/bottles/$bottleId"
              params={{ bottleId }}
              title="View Bottle"
              aria-label="View Bottle"
              className="cursor-pointer"
            >
              <LinkIcon />
            </Link>
          )}
        </button>
      </div>
    </div>
  );
}
