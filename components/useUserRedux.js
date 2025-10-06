import { useSelector } from 'react-redux';

export default function useUserRedux() {
  const reduxUser = useSelector(state =>
    state.userReducer &&
    state.userReducer.update &&
    state.userReducer.update.usuario &&
    state.userReducer.update.usuario.user
      ? state.userReducer.update.usuario.user
      : null
  );
  return reduxUser;
}
