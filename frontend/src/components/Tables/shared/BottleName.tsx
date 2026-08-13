import { Link } from '@tanstack/react-router';
import LinkIcon from '../../Icons/LinkIcon';

export default function BottleName({ name, bottleId }: { name: string; bottleId: string }) {
  return (
    <div className="flex justify-between">
      <div>{name} </div>
      <div>
        <button type="button" className="align-middle">
          <Link
            to="/bottles/$bottleId"
            params={{ bottleId }}
            title="View Bottle"
            aria-label="View Bottle"
            className="cursor-pointer"
          >
            <LinkIcon />
          </Link>
        </button>
      </div>
    </div>
  );
}
