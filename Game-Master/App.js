import React, { useContext } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { PaperProvider } from "react-native-paper";

// Components Imports
import LoginPage from "../Game-Master/components/LoginPage";
import EventDetails from "../Game-Master/components/EventDetails";
import AccountPage from "./components/AccountPage";
import CreateAccount from "./components/CreateAccount";
import CreateEvent from "./components/CreateEvent";
import Collection from "./components/Collection";
import MessagesScreen from "./components/MessagesScreen";
import MyEventPage from "./components/MyEventPage";
import EventList from "./components/EventsPage/EventList";
import Chat from "./components/Chat";
import Footer from "./components/Footer";
import EventsPage from "./components/EventsPage/EventsPage";

// Context Imports
import UserProvider from "./components/Context/ContextProvider";
import { NotificationCountContext } from "./components/Context/NotificationCountContext";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const EventsStack = createStackNavigator();
const CreateEventStack = createStackNavigator();

const EventsStackNavigator = () => (
  <EventsStack.Navigator>
    <EventsStack.Screen name="EventsPage" component={EventsPage} options={{ headerShown: false }} />
    <EventsStack.Screen name="Event Details" component={EventDetails} options={{ headerShown: false }} />
    <EventsStack.Screen name="My Event" component={MyEventPage} options={{ headerShown: false }} />
  </EventsStack.Navigator>
);

const CreateEventStackNavigator = () => (
  <CreateEventStack.Navigator style={{ backgroundColor: "rgb(37, 35, 42)" }}>
    <CreateEventStack.Screen name="Create Event" component={CreateEvent} options={{ headerShown: false }} />
    <CreateEventStack.Screen name="My Event" component={MyEventPage} options={{ headerShown: false }} />
  </CreateEventStack.Navigator>
);

const MainDrawer = ({ navigation }) => {
  const { notificationCount } = useContext(NotificationCountContext);

  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: "black" }, headerTintColor: "white" }}>
        <Drawer.Screen name="My Account" component={AccountPage} />
        <Drawer.Screen name="Events" component={EventsStackNavigator} />
        <Drawer.Screen name="Collection" component={Collection} />
        <Drawer.Screen name="Chat" component={Chat} />
        <Drawer.Screen name="Create Event" component={CreateEventStackNavigator} />
        <Drawer.Screen name="Notifications" component={MessagesScreen} options={{ drawerLabel: notificationCount > 0 ? `Notifications: ${notificationCount}` : "Notifications", drawerLabelStyle: { color: notificationCount > 0 ? "red" : "grey" } }} />
      </Drawer.Navigator>
      <Footer />
    </View>
  );
};

const App = () => (
  <UserProvider>
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Create Account" component={CreateAccount} />
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
          <Stack.Screen name="EventDetails" component={EventDetails} />
          <Stack.Screen name="EventList" component={EventList} />
          <Stack.Screen name="MyEventPage" component={MyEventPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </UserProvider>
);

export default App;
