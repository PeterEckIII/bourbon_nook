import { RouterProvider } from '@tanstack/react-router';
import './App.css';
import { useAuth } from './auth/auth';
import { router } from './main';

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return null;
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
