import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, SectionList, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import StyledTextInput from "../components/StyledTextInput";

import ListItem from "../components/ListItem";
import useCombinedAPI from "../hooks/useCombinedAPI";
import useGetAPI from "../hooks/useGetAPI";
import StyledButton from "../components/StyledButton";

const CreateAccountView = ({ navigation: { goBack }, route }) => {
  const dispatchStore = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const isLoading = useSelector((state) => state.loader.isLoading);
  const is_manager = useSelector((state) => state.auth.permissions.is_manager);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("");
  const [jobList, setJobList] = useState([]);

  const [staffID, setStaffID] = useState("");

  const getAPI = useGetAPI();
  const combinedAPI = useCombinedAPI();

  const handleSubmit = () => {
    combinedAPI.combinedAPI(
      `/jobs/${route.params.job.id}/job-status/`,
      { staff: user.id, status: "APPLIED" },
      "post"
    );
  };

  const handleWidthdraw = () => {
    combinedAPI.combinedAPI(
      `/jobs/${route.params.job.id}/job-status/`,
      { staff: user.id, status: "WIDTHDRAWN" },
      "post"
    );
  };

  const handleCheckIn = () => {
    combinedAPI.combinedAPI(
      `/jobs/${route.params.job.id}/job-status/`,
      { staff: user.id, status: "CHECKED IN" },
      "post"
    );
  };

  const handleCheckOut = () => {
    combinedAPI.combinedAPI(
      `/jobs/${route.params.job.id}/job-status/`,
      { staff: user.id, status: "CHECKED OUT" },
      "post"
    );
  };

  const handleManager = () => {
    Alert.alert(
      "Do you wish to update status?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            handleOK();
          },
          style: "default",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  const handleOK = () => {
    switch (status) {
      case "APPLIED":
        combinedAPI.combinedAPI(
          `/jobs/${route.params.job.id}/job-status/`,
          { staff: staffID, status: "CONFIRMED" },
          "post"
        );
        break;

      case "CONFIRMED":
        combinedAPI.combinedAPI(
          `/jobs/${route.params.job.id}/job-status/`,
          { staff: staffID, status: "CANCELED" },
          "post"
        );
        break;

      case "CHECKED OUT":
        combinedAPI.combinedAPI(
          `/jobs/${route.params.job.id}/job-status/`,
          { staff: staffID, status: "APPROVED" },
          "post"
        );
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (route.params.job) {
      setStartTime(
        `${route.params.job.start_time.split("T")[0]} / ${
          route.params.job.start_time.split("T")[1].split("+")[0]
        }`
      );
      setEndTime(
        `${route.params.job.end_time.split("T")[0]} / ${
          route.params.job.end_time.split("T")[1].split("+")[0]
        }`
      );
    }
    if (!is_manager) getAPI.getAPI(`/jobs/${route.params.job.id}/${user.id}/`);
    else getAPI.getAPI(`/jobs/${route.params.job.id}/`);
  }, []);

  useEffect(() => {
    if (getAPI.response && !is_manager) setStatus(getAPI.response.status);
    else if (getAPI.response && is_manager) {
      setJobList([
        {
          title: "",
          data: getAPI.response.applied,
        },
      ]);
    }
  }, [getAPI.response]);

  // useEffect(() => {
  //   if (combinedAPI.response) goBack();
  //   else setSubmit(false);
  // }, [combinedAPI.response]);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   if (submit && validation) {
  //     setValidation(false);
  //     combinedAPI.combinedAPI(`/jobs/create/`, submit, "put");
  //   }
  //   return () => controller.abort();
  // }, [submit]);

  return is_manager ? (
    <View style={styles.container}>
      {/* {!getAPI.response.length && !isLoading && <Text style={styles.textStyle}>Pull to Refresh</Text>} */}
      <SectionList
        sections={jobList}
        // data={response}
        keyExtractor={({ id }) => id}
        onRefresh={() => {
          getAPI("/jobs/");
        }}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => {
              setStaffID(item.staff.id);
              setStatus(item.status);
              handleManager();
            }}
            title={item.staff.name}
            subtitle={`Status: ${item.status}`}
            // imgSrc={item.img ? { url: item.img } : require("../../assets/icon.png")}
          />
        )}
        // renderSectionHeader={({ section: { title } }) => (
        //   <Text style={styles.secHeader}>{title}</Text>
        // )}
      />
    </View>
  ) : (
    <ScrollView style={styles.container}>
      <Text style={styles.textStyle}>Location:</Text>
      <StyledTextInput value={route.params.job.location.name} editable={false}></StyledTextInput>
      <Text style={styles.textStyle}>Manager Name:</Text>
      <StyledTextInput value={route.params.job.created_by.name} editable={false}></StyledTextInput>
      <Text style={styles.textStyle}>Contact:</Text>
      <StyledTextInput
        value={route.params.job.created_by.cotact}
        editable={false}
      ></StyledTextInput>
      <Text style={styles.textStyle}>Address:</Text>
      <StyledTextInput value={route.params.job.location.address} editable={false}></StyledTextInput>
      <Text style={styles.textStyle}>Unit-No:</Text>
      <StyledTextInput value={route.params.job.location.unit_no} editable={false}></StyledTextInput>
      <Text style={styles.textStyle}>Postal:</Text>
      <StyledTextInput value={route.params.job.location.postal} editable={false}></StyledTextInput>
      <Text style={styles.textStyle}>Starting:</Text>
      <StyledTextInput value={startTime} editable={false}></StyledTextInput>
      <Text style={styles.textStyle}>Ending:</Text>
      <StyledTextInput value={endTime} editable={false}></StyledTextInput>
      <Text style={styles.textStyle}>Status:</Text>
      <StyledTextInput value={status} editable={false}></StyledTextInput>
      {!status && !is_manager && (
        <StyledButton title={"APPLY"} onPress={handleSubmit} style={styles.btnStyle} />
      )}
      {status == "APPLIED" && !is_manager && (
        <StyledButton title={"WIDTHDRAW"} onPress={handleWidthdraw} style={styles.btnStyle} />
      )}
      {status == "CONFIRMED" && !is_manager && (
        <StyledButton title={"CHECK IN"} onPress={handleCheckIn} style={styles.btnStyle} />
      )}
      {status == "CHECK IN" && !is_manager && (
        <StyledButton title={"CHECK OUT"} onPress={handleCheckOut} style={styles.btnStyle} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    alignSelf: "flex-start",
    textAlign: "left",
    fontSize: 20,
    color: "#333",
    fontWeight: "500",
    marginTop: 5,
    paddingLeft: 20,
  },

  btnStyle: {
    alignSelf: "center",
    width: 200,
    backgroundColor: "#36f",
  },

  warnStyle: {
    color: "red",
  },

  container: {
    paddingTop: 10,
    backgroundColor: "#fff",
    // alignItems: "center",
    ...StyleSheet.absoluteFill,
  },
});

export default CreateAccountView;
