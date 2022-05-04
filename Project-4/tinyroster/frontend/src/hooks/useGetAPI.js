import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loaderActions } from "../stores/loader";
import django from "../api/django";

import useGetAPI from "./useAuth";

export default (initialState = null) => {
  const dispatchStore = useDispatch();
  const access = useSelector((state) => state.auth.access);
  const [url, setURL] = useState("");
  const [signal, setSignal] = useState(null);
  const [response, setResponse] = useState(initialState);
  const { authIsValid, checkAuth } = useAuth();

  const getAPI = async () => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const headers = {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    };
    const res = await django.get(url, { signal, headers }).catch((err) => {
      console.error(err);
      dispatchStore(loaderActions.setError({ title: "API Failed", message: err.message }));
    });
    if (res.data) setResponse(res.data);
    dispatchStore(loaderActions.doneLoading());
  };

  useEffect(() => {
    if (authIsValid && url) getAPI();
  }, [authIsValid]);

  return {
    response,
    callGetAPI: (url) => {
      const controller = new AbortController();
      setURL(url);
      setSignal(controller.signal);
      checkAuth(controller);
      return () => controller.abort();
    },
  };
};
