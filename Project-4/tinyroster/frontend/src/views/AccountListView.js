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
  const isLoading = useSelector((state) => state.loader.isLoading);
  const { response, getAPI } = useGetAPI([]);
  const [accountList, setAccountList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      dispatchStore(loaderActions.clearError());
      return () => {
        dispatchStore(loaderActions.clearError());
      };
    }, [])
  );

  useEffect(() => {
    getAPI("/account/");
  }, []);

  useEffect(() => {
    const accounts = [...new Set(response.map(({ type }) => type.type))];
    setAccountList(
      accounts.map((acc) => ({
        title: acc,
        data: response.filter(({ type }) => type.type === acc),
      }))
    );
  }, [response]);

  return (
    <View style={styles.container}>
      {!response.length && !isLoading && <Text style={styles.textStyle}>Pull to Refresh</Text>}
      <SectionList
        sections={accountList}
        keyExtractor={({ id }) => id}
        onRefresh={() => {
          getAPI("/account/");
        }}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => navigate("Account Details", { user: item })}
            title={item.name}
            subtitle={item.contact}
            imgSrc={item.img ? { url: item.img } : require("../../assets/icon.png")}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.secHeader}>{title}</Text>
        )}
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
