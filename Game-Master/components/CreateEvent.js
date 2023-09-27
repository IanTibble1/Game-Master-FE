import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  Button,
  StyleSheet,
  View,
  Switch,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import postNewEvent from "./APIs/postEvent";
import { DbUserContext } from "./Context/UserContext";
import { fetchCollections } from "./APIs/getCollections";
import MonsterImageSelection from "./CreateEvent-Components/monsterImageSelect";

const CreateEvent = ({ navigation }) => {
  const { dbUser, setDbUser } = useContext(DbUserContext);
  const [timeError, setTimeError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const [formError, setFormError] = useState("");
  const [dateError, setDateError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedGameType, setSelectedGameType] = useState("");
  const [collections, setCollections] = useState([]);

  const [collectionDropdownVisible, setCollectionDropdownVisible] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const toggleCollectionDropdown = () => {
    setCollectionDropdownVisible(!collectionDropdownVisible);
  };

  const selectCollection = (collection) => {
    setEventData({ ...eventData, prizeCollection_id: collection._id });
    setSelectedCollection(collection);
    toggleCollectionDropdown();
  };

  // const [durationError, setDurationError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionsData = await fetchCollections();
        setCollections(collectionsData);
        console.log(collectionsData);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchData();
  }, []);

  const [eventData, setEventData] = useState({
    host_id: dbUser._id,
    image: "",
    gameInfo: "",
    isGameFull: false,
    game_type: "Board Game",
    dateTime: "",
    duration: "2:00:00",
    capacity: "",
    participants: [dbUser._id],
    prizeCollection_id: "1",
  });

  const validateDate = (text) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(text)) {
      setDateError("Please enter a valid date in YYYY-MM-DD format");
    } else {
      setDateError("");
    }
  };

  // const validateDuration = (text) => {
  //   const durationRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  //   if (!durationRegex.test(text)) {
  //     setDurationError("Please enter a valid duration");
  //   } else {
  //     setDurationError("");
  //   }
  // };

  const validateTime = (text) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(text)) {
      setTimeError("Please enter a valid time in HH:MM format");
    } else {
      setTimeError("");
    }
  };

  const validateLocation = (text) => {
    if (!text.trim()) {
      setLocationError("Location cannot be blank");
    } else {
      setLocationError("");
    }
  };

  const validateCapacity = (text) => {
    if (!/^\d+$/.test(text) && text !== "") {
      setCapacityError("Please enter a valid number for capacity");
    } else {
      setCapacityError("");
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateEvent = async () => {
    validateDate(date);
    validateTime(time);
    validateLocation(eventData.location);
    validateCapacity(eventData.capacity);
    // validateDuration(eventData.duration);

    if (dateError || timeError || locationError || capacityError) {
      setFormError("Please check the fields in red");
      setModalVisible(true);
      return;
    }
    try {
      const dateTime = `${date} ${time}`;

      const postResult = await postNewEvent({
        host_id: eventData.host_id,
        image: eventData.image,
        gameInfo: eventData.gameInfo,
        isGameFull: eventData.isGameFull,
        game_type: eventData.game_type,
        dateTime: dateTime,
        duration: eventData.duration,
        capacity: eventData.capacity,
        participants: eventData.participants,
        prizeCollection_id: eventData.prizeCollection_id,
      });
      console.log(postResult.data);
      if (postResult.data.acknowledged === true) {
        eventData._id = postResult.data.insertedId;
        navigation.navigate("My Event", {
          selectedEvent: eventData,
        });
      } else {
        setFormError("Failed to create event, please try again");
        setModalVisible(true);
      }
    } catch (err) {
      console.log(err);
      setFormError("Failed to create event, please try again");
      setModalVisible(true);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text>Game Type</Text>
            <Picker
              selectedValue={eventData.game_type}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setEventData({ ...eventData, game_type: itemValue });
                setSelectedGameType(itemValue);
              }}
            >
              <Picker.Item label="Board Game" value="Board Game" />
              <Picker.Item label="Card Game" value="Card Game" />
              <Picker.Item label="RPG" value="RPG" />
              <Picker.Item label="Tabletop Game" value="Tabletop Game" />
              <Picker.Item label="Video Game" value="Video Game" />
            </Picker>
          </View>
          <TextInput
            style={[styles.input, locationError ? styles.errorInput : null]}
            placeholder="Location"
            value={eventData.location}
            onChangeText={(text) =>
              setEventData({ ...eventData, location: text })
            }
          />
          <TextInput
            style={styles.input}
            // durationError ? styles.errorInput : null
            placeholder="Time (HH:MM)"
            value={eventData.duration}
            onChangeText={(text) =>
              setEventData({ ...eventData, duration: text })
            }
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Event Date (YYYY-MM-DD)</Text>
            <TextInput
              style={[styles.input, dateError ? styles.errorInput : null]}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
            />
          </View>

          <TextInput
            style={[styles.input, timeError ? styles.errorInput : null]}
            placeholder="Time (HH:MM)"
            value={time}
            onChangeText={(text) => {
              setTime(text);
            }}
          />

          <TextInput
            style={styles.input}
            placeholder="Capacity (Number)"
            value={eventData.capacity}
            onChangeText={(text) => {
              setEventData({ ...eventData, capacity: text });
            }}
            keyboardType="numeric"
          />

          <View style={styles.inputContainer}>
            <Text>Prize Collection</Text>
            <Button title="Reward" onPress={toggleCollectionDropdown} />
            {selectedCollection && (
              <View style={styles.selectedCollection}>
                <Text>Selected Collection:</Text>
                <Text>{selectedCollection.name}</Text>
                <MonsterImageSelection collectionId={selectedCollection._id} />
              </View>
            )}
            {collectionDropdownVisible && (
              <View style={styles.collectionDropdown}>
                {collections.map((collection) => (
                  <Button
                    key={collection._id}
                    title={collection.name}
                    onPress={() => selectCollection(collection)}
                  />
                ))}
              </View>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={eventData.gameInfo}
            onChangeText={(text) =>
              setEventData({ ...eventData, gameInfo: text })
            }
          />
        </View>
        <View>
          <View style={styles.imageContainer}>
            {selectedGameType ? (
              <>
                <Image
                  style={styles.images}
                  source={require(`../assets/gameType/${selectedGameType.split(" ")[0]
                    }.jpg`)}
                />
              </>
            ) : (
              <>
                <Image
                  source={require(`../assets/gameType/Dice.jpg`)}
                  style={styles.images}
                />
              </>
            )}
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "red", fontSize: 18 }}>{formError}</Text>
                <Button
                  title="Close"
                  onPress={() => {
                    setModalVisible(false);
                  }}
                />
              </View>
            </View>
          </Modal>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Public Event</Text>
            <Switch
              value={eventData.public}
              onValueChange={(value) =>
                setEventData({ ...eventData, public: value })
              }
            />
          </View>
        </View>

        <View style={styles.submitButton}>
          <Button title="Create Event" onPress={handleCreateEvent} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // input: {
  //   width: "80%",
  //   height: 40,
  //   borderColor: "gray",
  //   borderWidth: 1,
  //   marginVertical: 10,
  //   paddingLeft: 10,
  // },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  picker: {
    width: "50%",
    marginLeft: 10,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  imageContainer: {
    marginTop: 20,
    height: 200,
    width: 200,
    backgroundColor: "#ccc",
  },
  images: {
    margin: "auto",
    width: 180,
    height: 180
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },

  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default CreateEvent;
