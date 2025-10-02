import { browserRouter } from '@/routes/browserRouter';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="fade-in">
      <RouterProvider router={browserRouter} />
      <Toaster closeButton />
    </div>
  );
}

export default App;
