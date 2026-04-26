import { createBrowserRouter, Outlet } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Backtest from './pages/Backtest';
import Radar from './pages/Radar';
import Strategies from './pages/Strategies';
import History from './pages/History';
import Account from './pages/Account';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/backtest',
        element: <Backtest />,
      },
      {
        path: '/radar',
        element: <Radar />,
      },
      {
        path: '/strategies',
        element: <Strategies />,
      },
      {
        path: '/history',
        element: <History />,
      },
      {
        path: '/account',
        element: <Account />,
      },
    ],
  },
]);

export default router;