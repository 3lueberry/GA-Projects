import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { FontAwesome } from "@expo/vector-icons";
import StyledButton from "../components/StyledButton";

const ListItem = ({ children, title, subtitle, onPress, style, imgSrc }) => {
  const LeftSwipeActions = () => {
    return (
      <View style={{ flex: 1, backgroundColor: "#ccffbd", justifyContent: "center" }}>
        <FontAwesome name="user-circle-o" size={30} color="grey" />
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <View style={styles.container}>
        <Image source={imgSrc} style={styles.iconStyle} />
        <View style={styles.textViewStyle}>
          <Text style={styles.titleStyle}>{title}</Text>
          {subtitle ? <Text style={styles.subtitleStyle}>{subtitle}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    paddingLeft: 12,
    paddingTop: 12,
    color: "#333",
  },

  subtitleStyle: {
    paddingLeft: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: "black",
  },

  iconStyle: {
    height: 60,
    width: 60,
    margin: 10,
  },

  textViewStyle: {
    flex: 1,
    flexDirection: "column",
    borderBottomColor: "#333",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  container: {
    flex: 1,
    paddingVertical: 5,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ListItem;
