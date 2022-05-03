import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../stores/auth";

import axios from "axios";

const AccountDetailsView = () => {
  console.log("This is AccountDetailsView");

  const dispatchStore = useDispatch();
  const token = useSelector((state) => state.auth);

  const [submit, setSubmit] = useState(false);
  const [signup, setSignup] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

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

export default AccountDetailsView;
