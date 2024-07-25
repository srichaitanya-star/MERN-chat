import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./Modal/ProfileModal";
import { useNavigate } from "react-router-dom";
import { removeData } from "../../utils/localStorage";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserComponents/UserListItem";
import { getSender } from "../Config/Chatlogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import Sound from "../Sound/Notification.wav";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const navigate = useNavigate();

  const play = () => {
    new Audio(Sound).play();
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
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

  const logoutHandler = () => {
    removeData("userInfo");
    navigate("/");
    window.location.reload();
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "https://mern-chat-app-qm6p.onrender.com/chats",
        { userId },
        config
      );

      if (!chats.find((ele) => ele._id === data._id))
        setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error fetching the Chat",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"whiteAlpha.900"}
        w={"100%"}
        p={"5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip
          label="Search Users to Chat"
          hasArrow
          placement="bottom-end"
          aria-label="A tooltip"
        >
          <Button
            onClick={onOpen}
            w={"auto"}
            leftIcon={<Search2Icon />}
            variant={"ghost"}
          >
            <Text
              ml={-5}
              fontSize={"15px"}
              fontWeight={"500"}
              display={{ base: "none", md: "flex" }}
              px="4"
            >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text>MERN-CHAT</Text>
        <Box flexDirection={"row"} gap={5}>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon boxSize={5} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((ele) => (
                <MenuItem
                  key={ele._id}
                  onClick={() => {
                    setSelectedChat(ele.chat);
                    setNotification(notification.filter((n) => n !== ele));
                    play();
                  }}
                >
                  {ele.chat.isGroupChat
                    ? `New Message in ${ele.chat.chatName}`
                    : `New Message from ${getSender(user, ele.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Search Users</DrawerHeader>

            <DrawerBody>
              <Box display={"flex"} pb={5}>
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((ele) => (
                  <UserListItem
                    key={ele._id}
                    user={ele}
                    handleFunction={() => accessChat(ele._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
            </DrawerBody>

            {/* <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">Save</Button>
            </DrawerFooter> */}
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};

export default SideDrawer;
