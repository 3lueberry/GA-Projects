import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { loaderActions } from "../stores/loader";
import { Picker } from "@react-native-picker/picker";

import StyledTextInput from "../components/StyledTextInput";
import { FontAwesome } from "@expo/vector-icons";

import useCombinedAPI from "../hooks/useCombinedAPI";
import StyledButton from "../components/StyledButton";

const CreateAccountView = ({ navigation: { goBack }, route }) => {
  const dispatchStore = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("PARTTIMER");
  const [submit, setSubmit] = useState(true);
  const [validation, setValidation] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const contactRef = useRef();

  const combinedAPI = useCombinedAPI();

  const handleSubmit = () => {
    setValidation(true);
    if (username === "") usernameRef.current.focus();
    else {
      setSubmit({ username, password, name, contact, type });
    }
  };

  useEffect(() => {
    if (route.params.user) {
      setName(route.params.user.name);
      setContact(route.params.user.contact);
      setType(route.params.user.type.type);
    }
  }, []);

  useEffect(() => {
    if (combinedAPI.response) goBack();
    else setSubmit(false);
  }, [combinedAPI.response]);

  useEffect(() => {
    const controller = new AbortController();
    if (submit && validation) {
      setValidation(false);
      combinedAPI.combinedAPI(`/account/create/`, submit, "put");
    }
    return () => controller.abort();
    //eslint-disable-next-line
  }, [submit]);

  return (
    <View style={styles.container}>
      <StyledTextInput value={name}>
        <FontAwesome name="user-circle-o" size={30} color="grey" />
      </StyledTextInput>
      <StyledTextInput value={contact}>
        <FontAwesome name="mobile" size={30} color="grey" style={{ paddingLeft: 10 }} />
      </StyledTextInput>

      <StyledTextInput value={type}>
        <FontAwesome name="users" size={30} color="grey" style={{ paddingLeft: 0 }} />
      </StyledTextInput>
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
