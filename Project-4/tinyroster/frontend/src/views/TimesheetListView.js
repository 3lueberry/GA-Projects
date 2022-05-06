import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, SectionList } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { loaderActions } from "../stores/loader";

import useGetAPI from "../hooks/useGetAPI";
import ListItem from "../components/ListItem";

const AccountListView = ({ navigation: { navigate } }) => {
  console.log("This is AccountListView");

  const dispatchStore = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.loader.isLoading);
  const { response, getAPI } = useGetAPI([]);
  const [jobList, setJobList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      dispatchStore(loaderActions.clearError());
      return () => {
        dispatchStore(loaderActions.clearError());
      };
    }, [])
  );

  useEffect(() => {
    getAPI(`/timesheets/${user.id}`);
  }, []);

  useEffect(() => {
    setJobList([
      {
        title: "",
        data: response,
      },
    ]);
    if (response.length) console.log(typeof response[0].start_time);
  }, [response]);

  return (
    <View style={styles.container}>
      {!response.length && !isLoading && <Text style={styles.textStyle}>Pull to Refresh</Text>}
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
            onPress={() => navigate("Job Details", { timesheet: item })}
            title={item.period}
            // subtitle={`Date: ${item.start_time.split("T")[0]}`}
            // imgSrc={item.img ? { url: item.img } : require("../../assets/icon.png")}
          />
        )}
        // renderSectionHeader={({ section: { title } }) => (
        //   <Text style={styles.secHeader}>{title}</Text>
        // )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    flex: 1,
    textAlign: "center",
    paddingTop: 10,
    color: "#666",
  },

  secHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: "500",
    padding: 10,
    color: "white",
    backgroundColor: "#369",
  },

  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    // alignItems: "center",
    // justifyContent: "center",
  },
});

export default AccountListView;
