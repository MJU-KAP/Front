import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { savePostLoginRedirect } from '../utils/postLoginRedirect';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectPath?: string;
}

const ProtectedRoute = ({
  isAuthenticated,
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated) {
    const returnPath = `${location.pathname}${location.search}`;
    savePostLoginRedirect(returnPath);

    return (
      <Navigate to={redirectPath} replace state={{ from: location }} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;