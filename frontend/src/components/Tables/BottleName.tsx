import { useUserBottleSuspense } from '../../api/generated/bottles-api';
import SharedBottleName from './shared/BottleName';

export default function BottleName({ bottleId, reviewId }: { bottleId: string; reviewId: string }) {
  const bottle = useUserBottleSuspense(bottleId);
  return <SharedBottleName name={bottle.data.name!} bottleId={bottleId} reviewId={reviewId} />;
}
