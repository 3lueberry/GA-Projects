import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../stores/auth";
import django from "../api/django";

export default () => {
  const dispatchStore = useDispatch();
  const token = useSelector((state) => state.auth);
  const headers = {
    Authorization: `Bearer ${token.access}`,
    "Content-Type": "application/json",
  };

  const checkAuth = async () => {
    const res = await django.get("/auth/", { headers }).catch((err) => {
      // dispatchStore(authActions.clearAuth());
    });
    if (res) {
      return res.data;
    } else return false;
  };

  const getRefresh = async () => {
    const res = await django
      .post(`/auth/refresh/`, { refresh: token.refresh }, { headers })
      .catch((err) => {
        dispatchStore(authActions.clearAuth());
      });
    if (res) {
      dispatchStore(authActions.refreshAuth(res.data));
      return true;
    } else return false;
  };

  const logout = async () => {
    const res = await django.post(`/logout/`, { refresh: token.refresh }).catch((err) => {
      dispatchStore(authActions.clearAuth());
    });
    if (res) {
      dispatchStore(authActions.clearAuth());
      return true;
    } else return false;
  };

  return { checkAuth, getRefresh, logout };
};
