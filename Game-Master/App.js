import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, Text } from "react-native";
import LoginPage from "../Game-Master/components/LoginPage";
import EventDetails from "../Game-Master/components/EventDetails";
import EventList from "./components/EventList";
import AccountPage from "./components/AccountPage";
import CreateAccount from "./components/CreateAccount";
import CreateEvent from "./components/CreateEvent";
import Collection from "./components/Collection";
import { createStackNavigator } from "@react-navigation/stack";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import UserProvider from "./components/Context/UserProvider";
import { UserContext, DbUserContext } from "./components/Context/UserContext";
import React, { useState, useContext, useEffect } from "react";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const EventsStack = createStackNavigator();

function EventsStackNavigator() {
  return (
    <EventsStack.Navigator>
      <EventsStack.Screen
        name="EventList"
        component={EventList}
        options={{ title: "Events" }}
      />

      <EventsStack.Screen
        name="Event Details"
        component={EventDetails}
        options={{ title: "Event Details" }}
      />
    </EventsStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Account Tab" component={AccountPage} />
      <Tab.Screen name="Create Event Tab" component={CreateEvent} />
      <Tab.Screen name="Events" component={EventsStackNavigator} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Group>
              <Stack.Screen
                name="Login"
                component={LoginPage}
                options={{ title: "Login" }}
              />
              <Stack.Screen
                name="Create Account"
                component={CreateAccount}
                options={{ title: "Create Account" }}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="Create Event"
                component={CreateEvent}
                options={{ title: "Create Event" }}
              />
              <Stack.Screen
                name="MainTabs"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Account"
                component={AccountPage}
                options={{ title: "Account" }}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}

export default App;
