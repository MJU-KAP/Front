import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean; // 로그인 여부
  redirectPath?: string;    // 로그인 안 했을 때 보낼 경로
}

const ProtectedRoute = ({ 
  isAuthenticated, 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;