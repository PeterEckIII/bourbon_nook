import { RouterProvider } from '@tanstack/react-router';
import './App.css';
import { useAuth } from './auth/context';
import { router } from './router';

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return null;
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
