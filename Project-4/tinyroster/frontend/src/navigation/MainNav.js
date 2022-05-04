import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { useSelector, useDispatch } from "react-redux";
// import { loaderActions } from "../stores/loader";
import useAuth from "../hooks/useAuth";

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
  // const dispatchStore = useDispatch();
  // const token = useSelector((state) => state.auth);
  const access = useSelector((state) => state.auth.access);
  const permissions = useSelector((state) => state.auth.permissions);
  const [authIsValid, setAuthIsValid] = useState(false);
  const { checkAuth, getRefresh } = useAuth();

  // useEffect(async () => {
  //   dispatchStore(loaderActions.setIsLoading());
  //   console.log(token);
  //   if (access) {
  //     let auth = await checkAuth();
  //     if (!auth) auth = await getRefresh();
  //     if (auth) setAuthIsValid(true);
  //   }
  //   dispatchStore(loaderActions.doneLoading());
  // }, []);

  return (
    <>
      {!access ? (
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
                  <TopTabNav.Screen name="Locations">
                    {() => {
                      return (
                        <StackNav.Navigator>
                          <StackNav.Screen name="Location List" component={OutletListView} />
                          <StackNav.Screen name="Location Details" component={OutletDetailsView} />
                        </StackNav.Navigator>
                      );
                    }}
                  </TopTabNav.Screen>
                </TopTabNav.Navigator>
              );
            }}
          </BottomTabNav.Screen>
          {permissions.is_admin && (
            <BottomTabNav.Screen name="Accounts">
              {() => {
                return (
                  <StackNav.Navigator>
                    <StackNav.Screen name="Account List" component={AccountListView} />
                    <StackNav.Screen name="Account Details" component={AccountDetailsView} />
                  </StackNav.Navigator>
                );
              }}
            </BottomTabNav.Screen>
          )}
          <BottomTabNav.Screen name="Time Sheets" component={TimesheetListView} />
        </BottomTabNav.Navigator>
      )}
    </>
  );
};

export default MainNav;
