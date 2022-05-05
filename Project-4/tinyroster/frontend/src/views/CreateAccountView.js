import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Picker } from "react-native";
import { useDispatch } from "react-redux";
import { loaderActions } from "../stores/loader";

import StyledTextInput from "../components/StyledTextInput";
import { FontAwesome } from "@expo/vector-icons";

import django from "../api/django";
import StyledButton from "../components/StyledButton";

const CreateAccountView = ({ navigation: { goBack } }) => {
  const dispatchStore = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("PARTTIMER");
  const [submit, setSubmit] = useState(null);
  const [validation, setValidation] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const contactRef = useRef();

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
      <StyledTextInput
        value={username}
        inputRef={usernameRef}
        placeholder="username"
        textContentType="username"
        autoCapitalize="none"
        autoComplete={false}
        autoCorrect={false}
        blurOnSubmit={false}
        autoFocus={true}
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
      {validation && !username && <Text style={styles.warnStyle}>username required.</Text>}
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
        blurOnSubmit={false}
        editable={!submit}
        returnKeyType="next"
        onChangeText={(value) => {
          setPassword(value);
        }}
        onSubmitEditing={(e) => {
          nameRef.current.focus();
        }}
      >
        <FontAwesome name="lock" size={30} color="grey" style={{ paddingLeft: 5 }} />
      </StyledTextInput>
      <StyledTextInput
        value={name}
        inputRef={nameRef}
        placeholder="name"
        textContentType="name"
        autoCapitalize="words"
        blurOnSubmit={false}
        autoFocus={false}
        editable={!submit}
        returnKeyType="next"
        onChangeText={(value) => {
          setName(value);
        }}
        onSubmitEditing={(e) => {
          contactRef.current.focus();
        }}
      >
        <FontAwesome name="user-circle-o" size={30} color="grey" />
      </StyledTextInput>
      <StyledTextInput
        value={contact}
        inputRef={contactRef}
        placeholder="mobile no."
        textContentType="telephoneNumber"
        keyboardType="number-pad"
        blurOnSubmit={false}
        autoFocus={false}
        editable={!submit}
        maxLength={8}
        returnKeyType="next"
        onChangeText={(value) => {
          setContact(value);
        }}
        onSubmitEditing={(e) => {
          contactRef.current.focus();
        }}
      >
        <FontAwesome name="mobile" size={30} color="grey" style={{ paddingLeft: 10 }} />
      </StyledTextInput>

      <Picker
        selectedValue={type}
        style={{ height: 0, width: 300, top: -70 }}
        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
        mode={Picker.MODE_DROPDOWN}
      >
        <Picker.Item label="Part Timer" value="PARTTIMER" />
        <Picker.Item label="Manager" value="MANAGER" />
        <Picker.Item label="HR Payroll" value="PAYROLL" />
        <Picker.Item label="Admin User" value="ADMIN" />
      </Picker>

      <StyledButton title="SUBMIT" onPress={handleSubmit} style={styles.btnStyle} />
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
    width: 200,
    backgroundColor: "#36f",
    top: 80,
  },

  warnStyle: {
    color: "red",
  },

  container: {
    paddingTop: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    ...StyleSheet.absoluteFill,
  },
});

export default CreateAccountView;
