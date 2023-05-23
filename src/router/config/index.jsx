import { lazy } from 'react';
import BaseLayout from '@/components/layouts/BaseLayout';

export const routersConfig = [{
  path: '/',
  layout: BaseLayout,
  element: lazy(() => import('../../pages/index.jsx')),
}];
