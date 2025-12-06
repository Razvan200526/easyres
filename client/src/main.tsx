import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './__init__/routes';
import { queryClient } from './shared/QueryClient';
import './tailwind.css';
import { ToastProvider } from './common/components/toast';
import * as Sentry from '@sentry/react';
import { HeroUIProvider } from '@heroui/react';


Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_URL,
  sendDefaultPii: true,
  integrations: [
    Sentry.replayIntegration()
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],

});

try {
  const elem = document.getElementById('root');
  if (!elem) {
    throw new Error('Root element not found');
  }


  const root = ReactDOM.createRoot(elem);
  root.render(
    <StrictMode>
      <Sentry.ErrorBoundary fallback={
        <div>
          <h1>Something went wrong</h1>
          <p>Please try again later</p>
        </div>
      }>
        <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <NuqsAdapter>
              <RouterProvider router={router} />
            </NuqsAdapter>
          </ToastProvider>
      </QueryClientProvider>
      </HeroUIProvider>
      </Sentry.ErrorBoundary>
    </StrictMode>,
  );
} catch (error) {
  if (error instanceof Error) {
    console.error(error);
  }
}
