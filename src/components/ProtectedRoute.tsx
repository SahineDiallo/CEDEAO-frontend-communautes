import { Navigate, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useAppSelector } from '../hooks/useAppSelector';

const ProtectedRoute = () => {
  // const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isAuthenticated = false;

  return isAuthenticated ? (<Outlet />) : (<Navigate to="/login" />);
};

export default ProtectedRoute;