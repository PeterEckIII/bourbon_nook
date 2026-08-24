import { RouterProvider } from '@tanstack/react-router';
import './App.css';
import { useAuth } from './auth/context';
import { router } from './router';
import appIcon from './assets/brand/svg/app-icon.svg';

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="flex min-h-screen items-center justify-center bg-ground"
      >
        <img src={appIcon} alt="" className="h-12 w-12 animate-pulse motion-reduce:animate-none" />
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
