import { Outlet } from "@remix-run/react";

export default function BottlesRoute() {
  return (
    <div>
      <h1>Your Bottles</h1>
      <Outlet />
    </div>
  );
}
