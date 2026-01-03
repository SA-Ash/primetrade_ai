import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const AdminRoute: React.FC = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};
export default AdminRoute;
