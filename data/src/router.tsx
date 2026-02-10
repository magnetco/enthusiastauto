import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from './routes/RootLayout'
import { UsersRoute } from './routes/UsersRoute'
import { AccountsRoute } from './routes/AccountsRoute'
import { SessionsRoute } from './routes/SessionsRoute'
import { FavoritesRoute } from './routes/FavoritesRoute'
import { ServiceRequestsRoute } from './routes/ServiceRequestsRoute'
import { ServiceRequestDetailRoute } from './routes/ServiceRequestDetailRoute'
import { SellSubmissionsRoute } from './routes/SellSubmissionsRoute'
import { SellSubmissionDetailRoute } from './routes/SellSubmissionDetailRoute'
import { VersionsRoute } from './routes/VersionsRoute'
import { VehicleImportRoute } from './routes/VehicleImportRoute'
import { DocumentationRoute } from './routes/DocumentationRoute'
import { SettingsRoute } from './routes/SettingsRoute'
import TestLoaderPage from './routes/test-loader'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/users" replace />,
      },
      {
        path: 'users',
        element: <UsersRoute />,
      },
      {
        path: 'accounts',
        element: <AccountsRoute />,
      },
      {
        path: 'sessions',
        element: <SessionsRoute />,
      },
      {
        path: 'favorites',
        element: <FavoritesRoute />,
      },
      {
        path: 'service-requests',
        element: <ServiceRequestsRoute />,
      },
      {
        path: 'service-requests/:id',
        element: <ServiceRequestDetailRoute />,
      },
      {
        path: 'sell-submissions',
        element: <SellSubmissionsRoute />,
      },
      {
        path: 'sell-submissions/:id',
        element: <SellSubmissionDetailRoute />,
      },
      {
        path: 'versions',
        element: <VersionsRoute />,
      },
      {
        path: 'vehicle-import',
        element: <VehicleImportRoute />,
      },
      {
        path: 'documentation',
        element: <DocumentationRoute />,
      },
      {
        path: 'settings',
        element: <SettingsRoute />,
      },
      {
        path: 'test-loader',
        element: <TestLoaderPage />,
      },
    ],
  },
])
