import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { loaderActions } from "../stores/loader";

import StyledTextInput from "../components/StyledTextInput";
import { FontAwesome } from "@expo/vector-icons";

import django from "../api/django";
import StyledButton from "../components/StyledButton";

const ResetPasswordView = ({ navigation: { goBack } }) => {
  const dispatchStore = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [submit, setSubmit] = useState(null);
  const [validation, setValidation] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleSubmit = () => {
    setValidation(true);
    if (username === "") usernameRef.current.focus();
    else if (new_password === "" || new_password !== confirmPasswordRef.current.value)
      newPasswordRef.current.focus();
    else {
      setSubmit({ username, password, new_password });
    }
  };

  const patchResetPassword = async (signal) => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const res = await django.patch(`/reset-password/`, submit, { signal }).catch((err) => {
      console.error(err.message);
      dispatchStore(
        loaderActions.setError({ title: "Password Reset Failed", message: err.message })
      );
      setSubmit(null);
      setValidation(false);
    });
    dispatchStore(loaderActions.doneLoading());
    if (res && res.status === 202) goBack();
  };

  useEffect(() => {
    const controller = new AbortController();
    if (submit && validation) {
      setValidation(false);
      patchResetPassword(controller.signal);
    }
    return () => controller.abort();
    //eslint-disable-next-line
  }, [submit]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Reset Password</Text>
      <StyledTextInput
        value={password}
        inputRef={passwordRef}
        placeholder="old password"
        textContentType="password"
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete={false}
        autoCorrect={false}
        selectTextOnFocus={true}
        autoFocus={true}
        blurOnSubmit={false}
        editable={!submit}
        returnKeyType="next"
        onChangeText={(value) => {
          setPassword(value);
        }}
        onSubmitEditing={(e) => {
          usernameRef.current.focus();
        }}
      >
        <FontAwesome name="lock" size={30} color="grey" style={{ paddingLeft: 5 }} />
      </StyledTextInput>
      <StyledTextInput
        value={username}
        inputRef={usernameRef}
        placeholder="username"
        textContentType="username"
        autoCapitalize="none"
        autoComplete={false}
        autoCorrect={false}
        blurOnSubmit={false}
        editable={!submit}
        returnKeyType="next"
        onChangeText={(value) => {
          setUsername(value.trim());
        }}
        onSubmitEditing={(e) => {
          newPasswordRef.current.focus();
        }}
      >
        <FontAwesome name="user-circle-o" size={30} color="grey" />
      </StyledTextInput>
      <Text style={styles.warnStyle}>{validation && !username && "username required."}</Text>
      <StyledTextInput
        value={new_password}
        inputRef={newPasswordRef}
        placeholder="new password"
        textContentType="newPassword"
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete={false}
        autoCorrect={false}
        selectTextOnFocus={true}
        blurOnSubmit={false}
        editable={!submit}
        returnKeyType="next"
        onChangeText={(value) => {
          setNewPassword(value);
        }}
        onSubmitEditing={(e) => {
          confirmPasswordRef.current.focus();
        }}
      >
        <FontAwesome name="lock" size={30} color="grey" style={{ paddingLeft: 5 }} />
      </StyledTextInput>
      <StyledTextInput
        inputRef={confirmPasswordRef}
        placeholder="confirm password"
        textContentType="newPassword"
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete={false}
        autoCorrect={false}
        selectTextOnFocus={true}
        blurOnSubmit={false}
        editable={!submit}
        returnKeyType="send"
        onChangeText={(value) => {
          confirmPasswordRef.current.value = value;
          if (new_password === value) setValidation(false);
        }}
        onSubmitEditing={handleSubmit}
      >
        <FontAwesome name="lock" size={30} color="grey" style={{ paddingLeft: 5 }} />
      </StyledTextInput>
      <Text style={styles.warnStyle}>
        {validation && !new_password && "new password required."}
        {validation &&
          new_password &&
          new_password !== confirmPasswordRef.current.value &&
          "passwords do not match."}
      </Text>
      <StyledButton title="RESET" onPress={handleSubmit} style={styles.btnStyle} />
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

  btnStyle: {
    flex: 1,
    width: 200,
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

export default ResetPasswordView;
