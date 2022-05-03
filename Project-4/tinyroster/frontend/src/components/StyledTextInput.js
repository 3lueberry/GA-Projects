import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const StyledTextInput = ({ inputRef, children, ...props }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconStyle}>{children}</View>
      <TextInput {...props} ref={inputRef} style={styles.inputStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    flex: 1,
    fontSize: 18,
    padding: 10,
  },

  iconStyle: {
    paddingVertical: 10,
    paddingLeft: 10,
    width: 40,
  },

  container: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "whitesmoke",
    borderRadius: 5,
    margin: 10,
    backgroundColor: "whitesmoke",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default StyledTextInput;
