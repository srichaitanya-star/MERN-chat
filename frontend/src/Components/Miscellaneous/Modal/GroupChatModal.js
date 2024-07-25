import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Center,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../../UserComponents/UserListItem";
import UserBadgeItem from "../../UserComponents/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://mern-chat-app-qm6p.onrender.com/user/allUser?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "https://mern-chat-app-qm6p.onrender.com/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((ele) => ele._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (err) {
      toast({
        title: "Failed to create the Chat",
        description: err.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleGroup = (usersToAdd) => {
    if (selectedUsers.includes(usersToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, usersToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((ele) => ele._id !== delUser._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            gap={3}
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
          >
            <FormControl>
              <FormLabel>Chat Name</FormLabel>
              <Input
                placeholder="Chat Name"
                type="text"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            </FormControl>
            <FormControl>
              <FormLabel>Add Users</FormLabel>
              <Input
                // mb={5}
                placeholder="Add Users eg: John, Haris"
                type="email"
                onChange={(e) => handleSearch(e.target.value)}
              />
              {/* Selected Users */}
              <Box display={"flex"} flexWrap={"wrap"}>
                {selectedUsers.map((ele) => (
                  <UserBadgeItem
                    key={ele._id}
                    user={ele}
                    handleFunction={() => handleDelete(ele)}
                  />
                ))}
              </Box>

              {/* <Box mt={5}> */}
              {loading ? (
                <Center mt={2}>
                  <Spinner thickness="3px" color="blue.500" size={"lg"} />
                </Center>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((ele) => (
                    <UserListItem
                      user={ele}
                      key={ele._id}
                      handleFunction={() => handleGroup(ele)}
                    />
                  ))
              )}
              {/* </Box> */}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
