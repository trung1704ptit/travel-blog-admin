import { webRoutes } from '@/routes/web';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Redirect = () => {
  const admin = useSelector((state: RootState) => state.admin);

  // Check if user has valid token in Redux state (persisted via localStorage)
  const isAuthenticated = admin && admin.token;

  return (
    <Navigate
      to={isAuthenticated ? webRoutes.dashboard : webRoutes.login}
      replace
    />
  );
};

export default Redirect;
