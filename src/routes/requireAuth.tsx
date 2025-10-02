import { webRoutes } from '@/routes/web';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export type RequireAuthProps = {
  children: JSX.Element;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const admin = useSelector((state: RootState) => state.admin);
  const location = useLocation();

  // Don't redirect if already on login page to prevent redirect loop
  if (location.pathname === webRoutes.login) {
    return children;
  }

  // Check if user has valid token in Redux state (persisted via localStorage)
  if (!admin || !admin.token) {
    return <Navigate to={webRoutes.login} state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
