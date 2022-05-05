import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { FontAwesome } from "@expo/vector-icons";
import StyledButton from "../components/StyledButton";
import { useSelector, useDispatch } from "react-redux";

const ListItem = ({ children, title, subtitle, onPress, style, imgSrc, onDelete, onEdit }) => {
  const permissions = useSelector((state) => state.auth.permissions);
  const LeftSwipeActions = () => {
    return (
      <View style={{ width: 60, backgroundColor: "#33dd66", justifyContent: "center" }}>
        <StyledButton activeOpacity={0.5} style={styles.delBtnStyle} onPress={onEdit}>
          <FontAwesome name="edit" size={30} color="whitesmoke" />
        </StyledButton>
      </View>
    );
  };

  const RightSwipeActions = () => {
    return (
      <View
        style={{
          width: 60,
          backgroundColor: "#dd6633",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <StyledButton activeOpacity={0.5} style={styles.delBtnStyle} onPress={onDelete}>
          <FontAwesome name="trash" size={30} color="whitesmoke" />
        </StyledButton>
      </View>
    );
  };

  const swipeFromLeft = (e) => {
    console.log("EDIT");
  };

  const swipeFromRight = (e) => {
    console.log("DELETE");
  };

  return permissions.is_manager || permissions.is_admin ? (
    <Swipeable
      renderLeftActions={LeftSwipeActions}
      renderRightActions={RightSwipeActions}
      onSwipeableLeftOpen={swipeFromLeft}
      onSwipeableRightOpen={swipeFromRight}
      overshootFriction={15}
      activeOpacity={0}
      enableTrackpadTwoFingerGesture={true}
    >
      <TouchableOpacity delayPressIn={50} onPress={onPress} style={style}>
        <View style={styles.container}>
          {imgSrc && <Image source={imgSrc} style={styles.iconStyle} />}
          <View style={styles.textViewStyle}>
            <Text style={styles.titleStyle}>{title}</Text>
            {subtitle ? <Text style={styles.subtitleStyle}>{subtitle}</Text> : null}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  ) : (
    <TouchableOpacity delayPressIn={50} onPress={onPress} style={style}>
      <View style={styles.container}>
        {imgSrc && <Image source={imgSrc} style={styles.iconStyle} />}
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

  delBtnStyle: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    paddingLeft: 15,
    width: 60,
    height: 60,
    justifyContent: "center",
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
