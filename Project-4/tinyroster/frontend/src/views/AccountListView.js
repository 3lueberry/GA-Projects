import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../stores/auth";
import { loaderActions } from "../stores/loader";

import django from "../api/django";
import useAuth from "../hooks/useAuth";
import useGetAPI from "../hooks/useGetAPI";

const AccountListView = () => {
  console.log("This is AccountListView");

  const dispatchStore = useDispatch();
  const token = useSelector((state) => state.auth);

  const { authIsValid, checkAuth } = useAuth();
  const { response, callGetAPI } = useGetAPI([]);

  const [accountTypes, setAccountTypes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const abort = checkAuth();
      return () => {
        abort();
        dispatchStore(loaderActions.clearError());
      };
    }, [])
  );

  useEffect(() => {
    let abort = () => {};
    if (authIsValid) abort = callGetAPI("/account/");
    return () => {
      abort();
    };
  }, [authIsValid]);

  useEffect(() => {
    const accTypeArr = response.map(({ type }) => type.type);
    setAccountTypes([...new Set(accTypeArr)]);
  }, [response]);

  useEffect(() => {
    console.log(accountTypes);
  }, [accountTypes]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Hello World!</Text>
      {token.access && <Text>Welcome!</Text>}
      <Text>{process.env.SERVER_KEY}</Text>
      <Text>{process.env.SERVER_DOMAIN}</Text>
      <Text>{process.env.SERVER_PROJECT_ID}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {},

  container: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
  },
});

export default AccountListView;
