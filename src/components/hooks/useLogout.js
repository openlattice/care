import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AuthActions } from 'lattice-auth';

const { logout } = AuthActions;

const useLogout = () => {
  const dispatch = useDispatch();
  const dispatchLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return dispatchLogout;
};

export default useLogout;
