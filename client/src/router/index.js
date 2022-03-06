/**
 * The router of react
 * Created at 2021/11/14
 * Created by Alex.M
 */

import { useRoutes } from 'react-router';
import HomePage from '../pages/HomePage';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <HomePage />
    }
  ]);
}
