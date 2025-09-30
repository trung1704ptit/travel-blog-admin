import Layout from '@/components/layout';
import AuthLayout from '@/components/layout/authLayout';
import Redirect from '@/components/layout/redirect';
import ProgressBar from '@/components/loader/progressBar';
import LoginPage from '@/pages/auth/loginPage';
import ErrorPage from '@/pages/errors/errorPage';
import NotFoundPage from '@/pages/errors/notfoundPage';
import RequireAuth from '@/routes/requireAuth';
import { webRoutes } from '@/routes/web';
import loadable from '@loadable/component';
import { createBrowserRouter } from 'react-router-dom';

const errorElement = <ErrorPage />;
const fallbackElement = <ProgressBar />;

const DashboardPage = loadable(() => import('@/pages/dashboardPage'), {
  fallback: fallbackElement,
});
const UserListPage = loadable(() => import('@/pages/users/userListPage'), {
  fallback: fallbackElement,
});

const CategoryListPage = loadable(
  () => import('@/pages/category/cagegoryListPage'),
  {
    fallback: fallbackElement,
  }
);
const ArticleListPage = loadable(
  () => import('@/pages/articles/articleListPage'),
  {
    fallback: fallbackElement,
  }
);
const ArticleFormPage = loadable(
  () => import('@/pages/articles/articleFormPage'),
  {
    fallback: fallbackElement,
  }
);
const ArticlePreviewPage = loadable(
  () => import('@/pages/articles/articlePreviewPage'),
  {
    fallback: fallbackElement,
  }
);
const AboutPage = loadable(() => import('@/pages/aboutPage'), {
  fallback: fallbackElement,
});

export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <Redirect />,
    errorElement: errorElement,
  },

  // auth routes
  {
    element: <AuthLayout />,
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.login,
        element: <LoginPage />,
      },
    ],
  },

  // protected routes
  {
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.dashboard,
        element: <DashboardPage />,
      },
      {
        path: webRoutes.users,
        element: <UserListPage />,
      },
      {
        path: webRoutes.category,
        element: <CategoryListPage />,
      },
      {
        path: webRoutes.article,
        element: <ArticleListPage />,
      },
      {
        path: webRoutes.articleCreate,
        element: <ArticleFormPage />,
      },
      {
        path: webRoutes.articleEdit,
        element: <ArticleFormPage />,
      },
      {
        path: webRoutes.articlePreview,
        element: <ArticlePreviewPage />,
      },
      {
        path: webRoutes.about,
        element: <AboutPage />,
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: errorElement,
  },
]);
