import {
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

import {
  Text,
  Button,
  Card,
  Paragraph,
  Title,
  Avatar,
  IconButton,
} from "react-native-paper";
import DateInfo from "./EventDetails-Components/DateInfo";
import CapacityInfo from "./EventDetails-Components/CapacityInfo";
import PublicInfo from "./EventDetails-Components/PublicInfo";
import AttendeesInfo from "./EventDetails-Components/AttendeesInfo";
import RequestedParticipantInfo from "./EventDetails-Components/RequestedParticipantsInfo";
import TimeInfo from "./EventDetails-Components/TimeInfo";
import DescriptionInfo from "./EventDetails-Components/DescriptionInfo";
import axios from "axios";
import completeEvent from "./APIs/completeEvent";
import MonsterImageSelection from "./CreateEvent-Components/MonsterImageSelect";
import { Picker } from "@react-native-picker/picker";


const axiosBase = axios.create({
  baseURL: "https://game-master-be.onrender.com/api/",
});

const fetchUsers = () => axiosBase.get("users");


const MyEventPage = ({ route }) => {
  const { selectedEvent } = route.params;
  const [userList, setUserList] = useState([]);
  const [selectedWinner, setSelectedWinner] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [eventParticipants, setEventParticipants] = useState(selectedEvent.participants);
  const [requestedParticipants, setRequestedParticipants] = useState(selectedEvent.requestedToParticipate);

  const handleCompleteEvent = () => {
    console.log("here")
    if (!selectedWinner) {
      setShowWarningModal(true);
    } else {
      console.log(selectedWinner)
      completeEvent(selectedEvent._id, selectedEvent.hostedBy, eventParticipants, selectedWinner);
    }
  };

  const updateParticipants = (user_id) => {
    setEventParticipants((prevParticipants) => [...prevParticipants, user_id]);

    setRequestedParticipants((prevParticipants) =>
      prevParticipants.filter((id) => id !== user_id)
    );
  };

  function getUsernameFromId(userId) {
    const user = userList.find((user) => user._id === userId);
    return user ? user.username : 'Unknown User';
  }

  useEffect(() => {
    fetchUsers()
      .then(({ data }) => {
        setUserList(data);
      })
      .catch((err) => {
        console.error("Error fetching events: ", err);
      });
  }, []);

  return (
      <ScrollView>
        <SafeAreaView
          style={{
            backgroundColor: "purple",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Card
            style={{
              margin: "auto",
              height: "97%",
              marginTop: 10,
            }}
          >
            <Card.Content style={styles.eventCard}>
              <Card.Cover source={{ uri: selectedEvent.image }} />
              <View>
                <DescriptionInfo gameInfo={selectedEvent.gameInfo} />
              </View>
              <View style={styles.eventView}>
                <TimeInfo time={selectedEvent.dateTime} />
                <DateInfo date={selectedEvent.dateTime} />
              </View>
              <View style={styles.eventView}>
                <CapacityInfo
                  capacity={selectedEvent.capacity}
                  participants={selectedEvent.participants.length}
                />
                <PublicInfo public={selectedEvent.public} />
              </View>
              <View styles={styles.attendeeList}>
                {userList.length > 0 && (
                  <AttendeesInfo
                    userList={userList}
                    host={selectedEvent.hostedBy}
                    participants={eventParticipants}
                  />
                )}
              </View>
              <View styles={styles.attendeeList}>
                {userList.length > 0 && (
                  <RequestedParticipantInfo
                    userList={userList}
                    requestedToParticipate={requestedParticipants}
                    event_id={selectedEvent._id}
                    onUpdateParticipants={updateParticipants}
                  />
                )}
              </View>
              <View style={styles.attendeeList}>
                            {userList.length > 0 && (

                                < Picker
                                    selectedValue={selectedWinner}
                                    onValueChange={(itemValue, itemIndex) => {
                                        console.log(itemValue)
                                        const selectedWinnerIndex = eventParticipants.indexOf(itemValue);
                                        console.log(selectedWinnerIndex)
                                        const selectedWinner = eventParticipants[selectedWinnerIndex];
                                        console.log('Selected Winner:', selectedWinner);
                                        setSelectedWinner(selectedWinner);

                                    }}
                                >
                                    <Picker.Item label="Select a Winner" value={null} />
                                    {eventParticipants.map((participant, index) => (
                                        <Picker.Item
                                            key={index.toString()}
                                            label={getUsernameFromId(participant)}
                                            value={participant}
                                        />
                                    ))}
                                </Picker>
                            )}
                        </View>
              <View styles={styles.attendeeList}>
                {selectedEvent.isCompleted === "false" ? (
                  <>
                    <Button
                      style={styles.cardButtons}
                      title="submit"
                      onPress={() => handleCompleteEvent()}
                    >
                      <Text>Post event results</Text>
                    </Button>
                    <Button
                      style={styles.cardButtons}
                      title="cancel"
                      onPress={() => {}}
                    >
                      <Text>Cancel event</Text>
                    </Button>
                    <Button
                      style={styles.cardButtons}
                      title="backToEvents"
                      onPress={() => {}}
                    >
                      <Text>Back to Events</Text>
                    </Button>
                  </>
                ) : (
                  <Text>This event is already completed</Text>
                )}
              </View>
              ;
            </Card.Content>
            <View>
              <Text>Event Prize:</Text>
              <MonsterImageSelection
                collectionId={selectedEvent.prizeCollection_id}
              />
            </View>
          </Card>
          <Modal
            visible={showWarningModal}
            onRequestClose={() => setShowWarningModal(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Please select a winner before completing the event.</Text>
              <Button
                style={styles.cardButtons}
                title="submit"
                onPress={() => setShowWarningModal(false)}
              >
                <Text>Post event results</Text>
              </Button>
              <Button
                style={styles.cardButtons}
                title="cancel"
                onPress={() => {}}
              >
                <Text>Cancel event</Text>
              </Button>
              <Button
                style={styles.cardButtons}
                title="backToEvents"
                onPress={() => {}}
              >
                <Text>Back to Events</Text>
              </Button>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  eventCard: {},
  eventView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "purple",
    marginBottom: 15,
    marginTop: 15,
  },
});

export default MyEventPage;