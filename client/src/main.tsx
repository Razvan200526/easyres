import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './__init__/routes';
import { queryClient } from './shared/QueryClient';
import './tailwind.css';
import { ToastProvider } from './common/components/toast';

try {
  const elem = document.getElementById('root');
  if (!elem) {
    throw new Error('Root element not found');
  }

  window.addEventListener('auth:unautorized', () => {
    throw new Error('Error');
  });
  const root = ReactDOM.createRoot(elem);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <NuqsAdapter>
            <RouterProvider router={router} />
          </NuqsAdapter>
        </ToastProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
} catch (error) {
  if (error instanceof Error) {
    console.error(error);
  }
}
