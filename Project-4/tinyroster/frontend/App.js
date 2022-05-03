import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import store from "./src/stores/main";

import HomeView from "./src/views/HomeView";
import LoginView from "./src/views/LoginView";
import ResetPasswordView from "./src/views/ResetPasswordView";

import AccountListView from "./src/views/AccountListView";
import AccountDetailsView from "./src/views/AccountDetailsView";
import JobListView from "./src/views/JobListView";
import JobDetailsView from "./src/views/JobDetailsView";
import OutletListView from "./src/views/OutletListView";
import OutletDetailsView from "./src/views/OutletDetailsView";
import TimesheetListView from "./src/views/TimesheetListView";
import TimesheetDetailsView from "./src/views/TimesheetDetailsView";
import MainNav from "./src/navigation/MainNav";

// const switchNav = createSwitchNavigator({
//   Home: createStackNavigator(
//     {
//       Home: HomeView,
//       Login: LoginView,
//       ResetPassword: ResetPasswordView,
//     },
//     {
//       initialRouteName: "Home",
//       defaultNavigationOptions: {
//         title: "Tiny Roster",
//       },
//     }
//   ),
//   MainApp: createBottomTabNavigator({
//     Profile: AccountDetailsView,
//   }),
// });

// const stackNav = createStackNavigator(
//   {
//     Home: HomeView,
//     Login: LoginView,
//     ResetPassword: ResetPasswordView,
//   },
//   {
//     initialRouteName: "Home",
//     defaultNavigationOptions: {
//       title: "Tiny Roster",
//     },
//   }
// );

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer style={styles.container}>
        <MainNav />
      </NavigationContainer>
      <StatusBar style="auto" />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
