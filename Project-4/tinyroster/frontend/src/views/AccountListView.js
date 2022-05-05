import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, SectionList, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { loaderActions } from "../stores/loader";

import useGetAPI from "../hooks/useGetAPI";
import useDeleteAPI from "../hooks/useDeleteAPI";
import ListItem from "../components/ListItem";
import StyledButton from "../components/StyledButton";

const AccountListView = ({ navigation: { navigate } }) => {
  console.log("This is AccountListView");

  const dispatchStore = useDispatch();
  const permissions = useSelector((state) => state.auth.permissions);
  const isLoading = useSelector((state) => state.loader.isLoading);
  const { response, getAPI } = useGetAPI([]);
  const [accountList, setAccountList] = useState([]);
  const [admin, setAdmin] = useState("");
  const [toDelete, setToDelete] = useState("");
  const deleter = useDeleteAPI();

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

  const handleDelete = () => {
    Alert.prompt("Admin Password", "Please confirm admin password.", setAdmin, "secure-text");
  };

  useEffect(async () => {
    if (toDelete && admin) {
      await deleter.deleteAPI(`/account/${toDelete}/delete/`, admin);
      getAPI("/account/");
      setToDelete("");
      setAdmin("");
    }
  }, [toDelete, admin]);

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
            onDelete={() => {
              setToDelete(item.id);
              handleDelete();
            }}
            onPress={() => navigate("Account Details", { user: item })}
            title={item.name}
            subtitle={item.contact}
            imgSrc={item.img ? { url: item.img } : require("../../assets/user.jpg")}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.secHeader}>{title}</Text>
        )}
        ListFooterComponent={() =>
          permissions.is_admin && (
            <StyledButton
              title="Create Account"
              onPress={() => {
                navigate("Create Account", { user: null });
              }}
              style={styles.btnStyle}
            />
          )
        }
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

  btnStyle: {
    marginVertical: 10,
    alignSelf: "center",
    width: 200,
    backgroundColor: "#36f",
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
