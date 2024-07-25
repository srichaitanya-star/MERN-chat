import { Avatar, Box, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./Config/Chatlogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((ele, i) => (
          <Box display={"flex"} key={ele._id}>
            {(isSameSender(messages, ele, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={ele.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mr={2}
                  mt={"7px"}
                  size={"sm"}
                  cursor={"pointer"}
                  name={ele.sender.name}
                  src={ele.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  ele.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                color: "black",
                marginLeft: isSameSenderMargin(messages, ele, i, user._id),
                marginTop: isSameUser(messages, ele, i, user._id) ? 3 : 10,
              }}
            >
              {ele.content}
            </span>
          </Box>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollChat;
