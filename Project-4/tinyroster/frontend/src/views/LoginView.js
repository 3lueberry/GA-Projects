import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../stores/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

import StyledTextInput from "../components/StyledTextInput";
import { FontAwesome } from "@expo/vector-icons";

import axios from "axios";

const LoginView = ({ navigation }) => {
  const dispatchStore = useDispatch();
  const token = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(null);
  const [validation, setValidation] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const [authToken, setAuth] = useState(null);

  const handleSubmit = () => {
    setValidation(true);
    if (username === "") usernameRef.current.focus();
    else if (password === "") passwordRef.current.focus();
    else {
      setSubmit({ username, password });
    }
  };

  const getData = async () => {
    try {
      const res = await AsyncStorage.getItem("tiny-roster");
      const { auth } = res != null ? JSON.parse(res) : { auth: null };
      setAuth(auth);
    } catch (e) {
      // error reading value
      console.error(e);
    }
  };

  useEffect(() => {
    setValidation(false);
    if (submit) console.log(submit);
  }, [submit]);

  useEffect(() => {
    getData();
  }, [token]);

  useEffect(() => {
    console.log(authToken);
  }, [authToken]);

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
          navigation.navigate("Reset Password");
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
