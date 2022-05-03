import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

const StyledButton = ({ onPress, children, title, ...props }) => {
  return (
    <TouchableOpacity {...props} onPress={onPress}>
      <View style={styles.container}>
        {children && <View style={styles.iconStyle}>{children}</View>}
        <Text style={styles.textStyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    flex: 1,
    fontSize: 18,
    padding: 5,
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },

  iconStyle: {
    paddingVertical: 5,
    paddingLeft: 10,
  },

  container: {
    // borderWidth: 1,
    // borderStyle: "solid",
    // borderColor: "whitesmoke",
    // height: 50,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: "#36f",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    // alignSelf: "center",
  },
});

export default StyledButton;
