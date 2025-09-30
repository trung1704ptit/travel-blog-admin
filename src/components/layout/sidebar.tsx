import { webRoutes } from '@/routes/web';
import Icon, { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { BiHomeAlt2 } from 'react-icons/bi';

export const sidebar = [
  {
    path: webRoutes.dashboard,
    key: webRoutes.dashboard,
    name: 'Dashboard',
    icon: <Icon component={BiHomeAlt2} />,
  },
  {
    path: webRoutes.users,
    key: webRoutes.users,
    name: 'Users',
    icon: <UserOutlined />,
  },
  {
    path: webRoutes.category,
    key: webRoutes.category,
    name: 'Category',
    icon: <UserOutlined />,
  },
  {
    path: webRoutes.article,
    key: webRoutes.article,
    name: 'Article',
    icon: <UserOutlined />,
  },
  {
    path: webRoutes.about,
    key: webRoutes.about,
    name: 'About',
    icon: <InfoCircleOutlined />,
  },
];
