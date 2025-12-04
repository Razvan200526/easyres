import { ApplicationsLayout } from '@client/applications/layout/ApplicationsLayout';
import { ApplicationInspectPage } from '@client/applications/pages/ApplicationInspectPage';
import { ApplicationPage } from '@client/applications/pages/ApplicationPage';
import { DashboardLayout } from '@client/dashboard/DashboardLayout';
import { HeroPage } from '@client/hero/HeroPage';
import { CoverLettersPage } from '@client/resources/cover-letter/CoverLettersPage';
import { CoverLetterInspectPage } from '@client/resources/cover-letter/CoverletterInspectPage';
import { FeatureNotImplemented } from '@client/resources/FeatureNotImplementedYet';
import { ResourceLayout } from '@client/resources/ResourceLayout';
import { ResumeInspectPage } from '@client/resources/resumes/ResumeInspectPage';
import { ResumePage } from '@client/resources/resumes/ResumePage';
import {
  AccountPage,
  PreferencesPage,
  ProfilePage,
  SecurityPage,
} from '@client/settings/pages';
import { SettingsLayout } from '@client/settings/SettingsLayout';
import { AuthLayout } from '@client/shared/components/layout/AuthLayout';
import { SigninPage } from '@client/signin/SignInPage';
import { SignupPage } from '@client/signup/SignUpPage';
import { ErrorFallback } from '@shared/components/ErrorFallback';
import { NotFoundPage } from '@shared/NotFoundPage';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, Outlet } from 'react-router';
export const ErrorBoundaryLayout = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Outlet />
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    element: <ErrorBoundaryLayout />,
    children: [
      {
        path: '/',
        element: <HeroPage />,
      },
      {
        path: '/signin',
        element: <SigninPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/home',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            path: 'dashboard',
            element: <DashboardLayout />,
          },
          {
            path: 'ask',
            element: <FeatureNotImplemented />,
          },
          {
            path: 'resources',
            element: <ResourceLayout />,
            children: [
              {
                index: true,
                element: <ResumePage />,
              },
              {
                path: 'coverletter',
                element: <CoverLettersPage />,
              },
              {
                path: 'coverletters/:id',
                element: <CoverLetterInspectPage />,
              },
              {
                path: 'chats',
                element: <FeatureNotImplemented />,
              },
              {
                path: 'resumes/:id',
                element: <ResumeInspectPage />,
              },
            ],
          },

          {
            path: 'settings',
            element: <SettingsLayout />,
            children: [
              {
                index: true,
                element: <ProfilePage />,
              },
              {
                path: 'account',
                element: <AccountPage />,
              },
              {
                path: 'security',
                element: <SecurityPage />,
              },
              {
                path: 'preferences',
                element: <PreferencesPage />,
              },
            ],
          },
          {
            path: 'applications',
            element: <ApplicationsLayout />,
            children: [
              {
                path: '',
                element: <ApplicationPage />,
              },
              {
                path: ':id',
                element: <ApplicationInspectPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/*',
    element: <NotFoundPage />,
  },
]);
