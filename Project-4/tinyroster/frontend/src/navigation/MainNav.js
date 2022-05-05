import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { useSelector } from "react-redux";

import HomeView from "../views/HomeView";
import LoginView from "../views/LoginView";
import ResetPasswordView from "../views/ResetPasswordView";

import AccountListView from "../views/AccountListView";
import AccountDetailsView from "../views/AccountDetailsView";
import JobListView from "../views/JobListView";
import JobDetailsView from "../views/JobDetailsView";
import OutletListView from "../views/OutletListView";
import OutletDetailsView from "../views/OutletDetailsView";
import TimesheetListView from "../views/TimesheetListView";
import TimesheetDetailsView from "../views/TimesheetDetailsView";

const StackNav = createNativeStackNavigator();
const BottomTabNav = createBottomTabNavigator();
const TopTabNav = createMaterialTopTabNavigator();

const LogoTitle = () => {
  return (
    <Image
      style={{ width: 150, height: 150, top: 100 }}
      source={require("../../assets/icon.png")}
    />
  );
};

const getTitle = (route) => {
  console.log(getFocusedRouteNameFromRoute(route));
  const routeName = getFocusedRouteNameFromRoute(route) ?? `Jobs`;
  return routeName;
};

const JobStack = () => {
  return (
    <StackNav.Navigator>
      <StackNav.Screen name="Job List" component={JobListView} options={{ headerShown: false }} />
      <StackNav.Screen
        name="Job Details"
        component={JobDetailsView}
        options={{ presentation: "modal" }}
      />
    </StackNav.Navigator>
  );
};

const LocationStack = () => {
  return (
    <StackNav.Navigator>
      <StackNav.Screen
        name="Location List"
        component={OutletListView}
        options={{ headerShown: false }}
      />
      <StackNav.Screen
        name="Location Details"
        component={OutletDetailsView}
        options={{ presentation: "modal" }}
      />
    </StackNav.Navigator>
  );
};

const AccountStack = () => {
  return (
    <StackNav.Navigator>
      <StackNav.Screen name="Account List" component={AccountListView} />
      <StackNav.Screen name="Account Details" component={AccountDetailsView} />
    </StackNav.Navigator>
  );
};

const FindJobTab = () => {
  return (
    <TopTabNav.Navigator>
      <TopTabNav.Screen name="Jobs">{JobStack}</TopTabNav.Screen>
      <TopTabNav.Screen name="Locations">{LocationStack}</TopTabNav.Screen>
    </TopTabNav.Navigator>
  );
};

const MainNav = () => {
  const token = useSelector((state) => state.auth);

  return (
    <>
      {!token.access ? (
        <StackNav.Navigator>
          <StackNav.Screen name="Home" component={HomeView} options={{ headerShown: false }} />
          <StackNav.Screen name="Login" component={LoginView} />
          <StackNav.Screen name="Reset Password" component={ResetPasswordView} />
        </StackNav.Navigator>
      ) : (
        <BottomTabNav.Navigator>
          <BottomTabNav.Screen
            name="Profile"
            component={AccountDetailsView}
            initialParams={{ user: token.user }}
            options={{ headerTitle: "My Profile" }}
          />
          <BottomTabNav.Screen
            name="Find Jobs"
            // options={({ route }) => ({
            //   headerTitle: getTitle(route),
            // })}
          >
            {FindJobTab}
          </BottomTabNav.Screen>
          {token.permissions.is_admin && (
            <BottomTabNav.Screen name="Accounts" options={{ headerShown: false }}>
              {AccountStack}
            </BottomTabNav.Screen>
          )}
          <BottomTabNav.Screen name="Time Sheets" component={TimesheetListView} />
        </BottomTabNav.Navigator>
      )}
    </>
  );
};

export default MainNav;
