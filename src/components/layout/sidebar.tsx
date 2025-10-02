import { webRoutes } from '@/routes/web';
import {
  BsFileText,
  BsHouse,
  BsInfoLg,
  BsPersonCircle,
  BsUiChecksGrid,
} from 'react-icons/bs';

export const sidebar = [
  {
    path: webRoutes.dashboard,
    key: webRoutes.dashboard,
    name: 'Dashboard',
    icon: <BsHouse />,
  },
  {
    path: webRoutes.users,
    key: webRoutes.users,
    name: 'Users',
    icon: <BsPersonCircle />,
  },
  {
    path: webRoutes.category,
    key: webRoutes.category,
    name: 'Category',
    icon: <BsUiChecksGrid />,
  },
  {
    path: webRoutes.article,
    key: webRoutes.article,
    name: 'Article',
    icon: <BsFileText />,
  },
  {
    path: webRoutes.about,
    key: webRoutes.about,
    name: 'About',
    icon: <BsInfoLg />,
  },
];
