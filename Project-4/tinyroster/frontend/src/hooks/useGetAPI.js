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
  const headers = {
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  };

  const getAPI = async (url) => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const res = await django.get(url, { headers }).catch(async (err) => {
      let auth = await checkAuth();
      if (!auth) auth = await getRefresh();
      if (auth) getAPI(url);
      else dispatchStore(loaderActions.setError({ title: "API Failed", message: err.message }));
    });
    if (res) setResponse(res.data);
    dispatchStore(loaderActions.doneLoading());
  };

  return { response, getAPI };
};
