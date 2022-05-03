import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

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

const MainNav = () => {
  const access = useSelector((state) => state.auth.access);
  const permissions = useSelector((state) => state.auth.permissions);
  return (
    <>
      {access ? (
        <StackNav.Navigator>
          <StackNav.Screen name="Home" component={HomeView} options={{ headerShown: false }} />
          <StackNav.Screen name="Login" component={LoginView} />
          <StackNav.Screen name="Reset Password" component={ResetPasswordView} />
        </StackNav.Navigator>
      ) : (
        <BottomTabNav.Navigator>
          <BottomTabNav.Screen name="Profile" component={AccountDetailsView} />
          <BottomTabNav.Screen name="Find Jobs">
            {() => {
              return (
                <TopTabNav.Navigator>
                  <TopTabNav.Screen name="Jobs">
                    {() => {
                      return (
                        <StackNav.Navigator>
                          <StackNav.Screen name="Job List" component={JobListView} />
                          <StackNav.Screen name="Job Details" component={JobDetailsView} />
                        </StackNav.Navigator>
                      );
                    }}
                  </TopTabNav.Screen>
                  <TopTabNav.Screen name="Outlets">
                    {() => {
                      return (
                        <StackNav.Navigator>
                          <StackNav.Screen name="Outlet List" component={JobListView} />
                          <StackNav.Screen name="Outlet Details" component={JobDetailsView} />
                        </StackNav.Navigator>
                      );
                    }}
                  </TopTabNav.Screen>
                </TopTabNav.Navigator>
              );
            }}
          </BottomTabNav.Screen>
          {permissions.is_admin && (
            <BottomTabNav.Screen name="Accounts" component={AccountListView} />
          )}
          <BottomTabNav.Screen name="Time Sheets" component={TimesheetListView} />
        </BottomTabNav.Navigator>
      )}
    </>
  );
};

export default MainNav;
