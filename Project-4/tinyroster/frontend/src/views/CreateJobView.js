import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-native-date-picker";

import StyledTextInput from "../components/StyledTextInput";
import { FontAwesome } from "@expo/vector-icons";

import useCombinedAPI from "../hooks/useCombinedAPI";
import StyledButton from "../components/StyledButton";

const CreateAccountView = ({ navigation: { goBack }, route }) => {
  const dispatchStore = useDispatch();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [no_staff, setNoStaff] = useState("1");
  const [submit, setSubmit] = useState(null);
  const [validation, setValidation] = useState(false);
  const noStaffRef = useRef();

  const combinedAPI = useCombinedAPI();

  const handleSubmit = () => {
    setValidation(true);
    if (no_staff === "") noStaffRef.current.focus();
    else {
      const start_time = `${startTime.toISOString().split(".")[0]}+08:00`;
      const end_time = `${endTime.toISOString().split(".")[0]}+08:00`;
      console.log(start_time, end_time);
      setSubmit({ start_time, end_time, no_staff });
    }
  };

  //   useEffect(() => {
  //     if (route.params.user) {
  //       setName(route.params.user.name);
  //       setContact(route.params.user.contact);
  //       setType(route.params.user.type.type);
  //     }
  //   }, []);

  useEffect(() => {
    if (combinedAPI.response) goBack();
    else setSubmit(false);
  }, [combinedAPI.response]);

  useEffect(() => {
    const controller = new AbortController();
    if (submit && validation) {
      setValidation(false);
      combinedAPI.combinedAPI(`/jobs/create/`, submit, "put");
    }
    return () => controller.abort();
    //eslint-disable-next-line
  }, [submit]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Start Date & Time</Text>
      {startTime && (
        <DateTimePicker
          mode={"datetime"}
          display="spinner"
          is24Hour={false}
          value={startTime}
          onChange={(e, v) => {
            console.log(v);
            setStartTime(v);
          }}
          textColor="#333"
          timeZoneOffsetInSeconds={8 * 3600}
          style={{ width: 400, height: 80, color: "black" }}
        />
      )}
      <Text style={styles.textStyle}>End Date & Time</Text>
      {endTime && (
        <DateTimePicker
          mode={"datetime"}
          display="spinner"
          is24Hour={false}
          value={endTime}
          onChange={(e, v) => {
            console.log(v);
            setEndTime(v);
          }}
          textColor="#333"
          style={{ width: 400, height: 80 }}
          timeZoneOffsetInSeconds={8 * 3600}
        />
      )}
      <StyledTextInput
        value={no_staff}
        inputRef={noStaffRef}
        placeholder="No. of Staffs"
        keyboardType="number-pad"
        blurOnSubmit={false}
        autoFocus={false}
        maxLength={8}
        returnKeyType="send"
        onChangeText={(value) => {
          setNoStaff(value);
        }}
        onSubmitEditing={(e) => {
          contactRef.current.focus();
        }}
      >
        <FontAwesome name="users" size={30} color="grey" style={{ paddingLeft: 0 }} />
      </StyledTextInput>
      {validation && !no_staff && <Text style={styles.warnStyle}>no. of staff required.</Text>}

      <StyledButton title="SUBMIT" onPress={handleSubmit} style={styles.btnStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    textAlign: "left",
    fontSize: 20,
    color: "#333",
    fontWeight: "500",
    marginTop: 30,
    marginBottom: 10,
  },

  btnStyle: {
    width: 200,
    backgroundColor: "#36f",
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
