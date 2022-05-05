import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { loaderActions } from "../stores/loader";

import useAuth from "../hooks/useAuth";

const AccountDetailsView = ({ navigation: { navigate }, route }) => {
  console.log("This is AccountDetailsView");

  const dispatchStore = useDispatch();
  const token = useSelector((state) => state.auth);
  const [authIsValid, setAuthIsValid] = useState(false);
  const { checkAuth, getRefresh } = useAuth();

  useFocusEffect(
    useCallback(() => {
      dispatchStore(loaderActions.clearError());
      return () => {
        dispatchStore(loaderActions.clearError());
      };
    }, [])
  );

  // useEffect(async () => {
  //   let auth = await checkAuth();
  //   if (!auth) auth = await getRefresh();
  //   if (auth) setAuthIsValid(true);
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Hello World!</Text>
      {token.access && <Text>Welcome, {token.user.name}!</Text>}
      <Text>{route.params.user.name}</Text>
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
