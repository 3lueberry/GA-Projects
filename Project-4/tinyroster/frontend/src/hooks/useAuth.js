import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../stores/auth";
import { loaderActions } from "../stores/loader";
import django from "../api/django";

export default (initialState = false) => {
  const dispatchStore = useDispatch();
  const token = useSelector((state) => state.auth);
  const [authIsValid, setAuthIsValid] = useState(initialState);

  const getAuth = async (signal) => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const headers = {
      Authorization: `Bearer ${token.access}`,
      "Content-Type": "application/json",
    };
    try {
      const res = await django.get("/auth/", { signal, headers }).catch(async (err) => {
        const refresh = await django
          .post(`/auth/refresh/`, { refresh: token.refresh }, { signal, headers })
          .catch((err) => {
            dispatchStore(authActions.clearAuth());
          });
        if (refresh.data) {
          setAuthIsValid(true);
          dispatchStore(authActions.refreshAuth(refresh.data));
        }
      });
      if (res.data) setAuthIsValid(res.data);
    } catch (err) {
      dispatchStore(
        loaderActions.setError({ title: "Authentication Failed", message: err.message })
      );
    }
    dispatchStore(loaderActions.doneLoading());
  };

  useEffect(() => {
    const controller = new AbortController();
    if ((token.access || token.refresh) && !authIsValid) getAuth(controller.signal);
    return () => controller.abort();
    //eslint-disable-next-line
  }, [authIsValid]);

  return [authIsValid, setAuthIsValid];

  // return {
  //   authIsValid,
  //   checkAuth: () => {
  //     setAuthIsValid(false);
  //     const controller = new AbortController();
  //     if (token.access || token.refresh) getAuth(controller.signal);
  //     return () => controller.abort();
  //   },
  // };
};
