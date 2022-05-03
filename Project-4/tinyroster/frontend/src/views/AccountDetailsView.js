import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../stores/auth";
import { loaderActions } from "../stores/loader";

import useAuth from "../hooks/useAuth";

const AccountDetailsView = () => {
  console.log("This is AccountDetailsView");

  const dispatchStore = useDispatch();
  const token = useSelector((state) => state.auth);

  const [submit, setSubmit] = useState(false);
  const [signup, setSignup] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const [authIsValid, setAuthIsValid] = useAuth();
  // const { authIsValid, checkAuth } = useAuth();

  useFocusEffect(
    useCallback(() => {
      // const abort = checkAuth();
      setAuthIsValid(false);
      return () => {
        // abort();
        dispatchStore(loaderActions.clearError());
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Hello World!</Text>
      {token.access && <Text>Welcome, {token.user.name}!</Text>}
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

export default AccountDetailsView;
