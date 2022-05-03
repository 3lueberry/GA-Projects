import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../stores/auth";
import { loaderActions } from "../stores/loader";

import StyledTextInput from "../components/StyledTextInput";
import { FontAwesome } from "@expo/vector-icons";

import django from "../api/django";

const LoginView = ({ navigation: { navigate } }) => {
  const dispatchStore = useDispatch();
  const token = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(null);
  const [validation, setValidation] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = () => {
    setValidation(true);
    if (username === "") usernameRef.current.focus();
    else if (password === "") passwordRef.current.focus();
    else {
      setSubmit({ username, password });
    }
  };

  const postLogin = async (signal) => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const res = await django.post(`/login/`, submit, { signal }).catch((err) => {
      console.error(err.message);
      dispatchStore(loaderActions.setError({ title: "Login Failed", message: err.message }));
      setSubmit(null);
      setValidation(false);
    });
    dispatchStore(loaderActions.doneLoading());
    if (res && res.status === 200) dispatchStore(authActions.setAuth(res.data));
  };

  useEffect(() => {
    const controller = new AbortController();
    if (submit && validation) {
      setValidation(false);
      postLogin(controller.signal);
    }
    return () => controller.abort();
    //eslint-disable-next-line
  }, [submit]);

  useEffect(() => {
    if (token.access) navigate("Profile");
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>LOGIN</Text>
      <StyledTextInput
        value={username}
        inputRef={usernameRef}
        placeholder="username"
        textContentType="username"
        autoCapitalize="none"
        autoComplete={false}
        autoCorrect={false}
        autoFocus={true}
        blurOnSubmit={false}
        editable={!submit}
        returnKeyType="next"
        onChangeText={(value) => {
          setUsername(value.trim());
        }}
        onSubmitEditing={(e) => {
          passwordRef.current.focus();
        }}
      >
        <FontAwesome name="user-circle-o" size={30} color="grey" />
      </StyledTextInput>
      <StyledTextInput
        value={password}
        inputRef={passwordRef}
        placeholder="password"
        textContentType="password"
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete={false}
        autoCorrect={false}
        selectTextOnFocus={true}
        blurOnSubmit={false}
        editable={!submit}
        returnKeyType="send"
        onChangeText={(value) => {
          setPassword(value);
        }}
        onSubmitEditing={handleSubmit}
      >
        <FontAwesome name="lock" size={30} color="grey" style={{ paddingLeft: 5 }} />
      </StyledTextInput>
      <Text style={styles.warnStyle}>
        {validation && !username && "username"}
        {validation && !username && !password && " and "}
        {validation && !password && "password"}
        {validation && (!username || !password) && " required."}
      </Text>
      <Button
        title="Reset Password"
        onPress={() => {
          navigate("Reset Password");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: "#333",
    fontWeight: "700",
    marginBottom: 30,
  },

  warnStyle: {
    color: "red",
  },

  container: {
    paddingTop: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    ...StyleSheet.absoluteFill,
  },
});

export default LoginView;
