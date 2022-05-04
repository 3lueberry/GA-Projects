import React from "react";
import { StyleSheet, ImageBackground, View, Image } from "react-native";
import { useSelector } from "react-redux";
import StyledButton from "../components/StyledButton";

const HomeView = ({ navigation: { navigate } }) => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/unsplash.jpg")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <Image style={styles.imgStyle} source={require("../../assets/icon.png")} />
        {!isLoading && (
          <StyledButton
            title="LOGIN"
            onPress={() => {
              navigate("Login");
            }}
            style={styles.btnStyle}
          />
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  imgStyle: {
    alignSelf: "center",
    width: 150,
    height: 150,
    bottom: 150,
  },

  btnStyle: {
    top: 200,
    backgroundColor: "#36f",
    paddingVertical: 10,
  },

  container: {
    flex: 1,
    ...StyleSheet.absoluteFill,
  },

  imgBackground: { flex: 1, justifyContent: "center" },
});

export default HomeView;
