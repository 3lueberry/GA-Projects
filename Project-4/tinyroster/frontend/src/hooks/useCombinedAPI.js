import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loaderActions } from "../stores/loader";
import django from "../api/django";

import useAuth from "./useAuth";

export default (initialState = null) => {
  const dispatchStore = useDispatch();
  const access = useSelector((state) => state.auth.access);
  const [response, setResponse] = useState(initialState);
  const { checkAuth, getRefresh } = useAuth();
  const [tryAgain, setTryAgain] = useState(false);
  const headers = {
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  };

  const combinedAPI = async (url, data = {}, method = "post") => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const config = {
      method: "delete",
      url,
      headers,
      data,
    };
    const res = await django(config).catch(async (err) => {
      let auth = await checkAuth();
      if (!auth) auth = await getRefresh();
      if (auth && tryAgain) deleteAPI(url, password);
      else dispatchStore(loaderActions.setError({ title: "API Failed", message: err.message }));
    });
    if (res) setResponse(res.data);
    dispatchStore(loaderActions.doneLoading());
    setTryAgain(false);
  };

  return { response, combinedAPI, setTryAgain };
};
