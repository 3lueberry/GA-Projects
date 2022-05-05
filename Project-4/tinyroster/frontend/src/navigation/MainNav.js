import React from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import StyledButton from "../components/StyledButton";
import useAuth from "../hooks/useAuth";

import HomeView from "../views/HomeView";
import LoginView from "../views/LoginView";
import ResetPasswordView from "../views/ResetPasswordView";

import AccountListView from "../views/AccountListView";
import AccountDetailsView from "../views/AccountDetailsView";
import CreateAccountView from "../views/CreateAccountView";
import JobListView from "../views/JobListView";
import JobDetailsView from "../views/JobDetailsView";
import OutletListView from "../views/OutletListView";
import OutletDetailsView from "../views/OutletDetailsView";
import TimesheetListView from "../views/TimesheetListView";
import TimesheetDetailsView from "../views/TimesheetDetailsView";

const StackNav = createNativeStackNavigator();
const BottomTabNav = createBottomTabNavigator();
const TopTabNav = createMaterialTopTabNavigator();

let mainLogout;

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
      <StackNav.Screen
        name="Account Details"
        component={AccountDetailsView}
        // options={({ navigation: { navigate } }) => ({
        //   headerRight: () => (
        //     <StyledButton style={{ ...styles.rightBtnStyle, paddingLeft: 15, paddingRight: 0 }}>
        //       <Ionicons
        //         name="add"
        //         size={30}
        //         color="#0b60ff"
        //         onPress={navigate("Create Account", { user: null })}
        //       />
        //     </StyledButton>
        //   ),
        // })}
      />
      <StackNav.Screen
        name="Create Account"
        component={CreateAccountView}
        options={{ presentation: "modal" }}
      />
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

const styles = StyleSheet.create({
  rightBtnStyle: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    paddingLeft: 0,
    paddingRight: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  leftBtnStyle: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    paddingLeft: 15,
    paddingRight: 0,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
});

const MainNav = () => {
  const token = useSelector((state) => state.auth);
  const { logout } = useAuth();
  mainLogout = logout;

  return (
    <>
      {!token.access ? (
        <StackNav.Navigator>
          <StackNav.Screen name="Home" component={HomeView} options={{ headerShown: false }} />
          <StackNav.Screen name="Login" component={LoginView} />
          <StackNav.Screen name="Reset Password" component={ResetPasswordView} />
        </StackNav.Navigator>
      ) : (
        <BottomTabNav.Navigator
          screenOptions={{
            headerRight: () => (
              <StyledButton style={styles.rightBtnStyle}>
                <Ionicons name="log-out-outline" size={30} color="#0b60ff" onPress={logout} />
              </StyledButton>
            ),
          }}
        >
          <BottomTabNav.Screen
            name="Profile"
            component={AccountDetailsView}
            initialParams={{ user: token.user }}
            options={{
              headerTitle: "My Profile",
              tabBarIcon: () => <FontAwesome name="user-o" size={24} />,
            }}
          />

          {!token.permissions.is_admin && !token.permissions.is_payroll && (
            <BottomTabNav.Screen
              name="Job Listings"
              options={({ navigation: { navigate }, route }) => ({
                headerTitle: getTitle(route),
                headerLeft: () => {
                  if (!token.permissions.is_manager) return null;
                  return (
                    <StyledButton style={styles.leftBtnStyle}>
                      <Ionicons
                        name="add"
                        size={30}
                        color="#0b60ff"
                        onPress={() => {
                          navigate("Job Details");
                        }}
                      />
                    </StyledButton>
                  );
                },
                tabBarIcon: () => <FontAwesome name="list-ul" size={24} />,
              })}
            >
              {FindJobTab}
            </BottomTabNav.Screen>
          )}
          {token.permissions.is_admin && (
            <BottomTabNav.Screen
              name="Accounts"
              options={{
                headerShown: false,
                tabBarIcon: () => <FontAwesome name="users" size={24} />,
              }}
            >
              {AccountStack}
            </BottomTabNav.Screen>
          )}
          {token.permissions.is_admin && (
            <BottomTabNav.Screen
              name="Locations"
              options={{
                headerShown: true,
                tabBarIcon: () => <FontAwesome name="map-o" size={24} />,
              }}
            >
              {LocationStack}
            </BottomTabNav.Screen>
          )}
          {!token.permissions.is_admin &&
            !token.permissions.is_manager &&
            !token.permissions.is_payroll && (
              <BottomTabNav.Screen
                name="My Time Sheet"
                component={TimesheetListView}
                options={{
                  headerShown: true,
                  tabBarIcon: () => <FontAwesome name="calendar-o" size={24} />,
                }}
              />
            )}
          {/* {token.permissions.is_manager && (
            <>
              <BottomTabNav.Screen name="Create Jobs" component={JobListView} />
              <BottomTabNav.Screen name="My Outlet" component={OutletDetailsView} />
            </>
          )} */}
        </BottomTabNav.Navigator>
      )}
    </>
  );
};

export default MainNav;
