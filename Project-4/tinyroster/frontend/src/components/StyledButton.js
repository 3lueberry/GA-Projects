import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

const StyledButton = ({ onPress, children, title, style, ...props }) => {
  return (
    <TouchableOpacity {...props} onPress={onPress} style={{ ...styles.touchStyle, ...style }}>
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
    flexDirection: "row",
    alignItems: "center",
  },

  touchStyle: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginHorizontal: 20,
    marginVertical: 5,
  },
});

export default StyledButton;
