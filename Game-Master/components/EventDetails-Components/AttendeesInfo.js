import React from "react";
import { Paragraph, IconButton } from "react-native-paper";
import { View } from "react-native";

const AttendeesInfo = ({ userList, host, participants }) => {
  const users = participants.map((participantId) =>
    userList.find((user) => user._id === participantId)
  );

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconButton icon="account-circle" size={16} color="gray" />
        <Paragraph style={{ fontWeight: "bold" }}>
          Currently attending:
        </Paragraph>
      </View>
      {users &&
        users.map((user, index) => (
          <Paragraph style={{ marginLeft: 30 }} key={index}>
            {"\u2022 "}
            {user.username}
            {user._id === host && " (Host)"}
          </Paragraph>
        ))}
    </View>
  );
};

export default AttendeesInfo;
