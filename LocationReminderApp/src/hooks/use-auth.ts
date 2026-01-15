import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { login, register, logout, loadUser } from '../store/slices/auth.slice';
import { LoginRequest, RegisterRequest } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleLogin = async (credentials: LoginRequest) => {
    return dispatch(login(credentials)).unwrap();
  };

  const handleRegister = async (data: RegisterRequest) => {
    return dispatch(register(data)).unwrap();
  };

  const handleLogout = async () => {
    return dispatch(logout()).unwrap();
  };

  const handleLoadUser = async () => {
    return dispatch(loadUser()).unwrap();
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    loadUser: handleLoadUser,
  };
};