import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor={"pointer"}
      //   border={"1px solid red"}
      display={"flex"}
      alignItems={"center"}
      bg={"blackAlpha.300"}
      gap={2}
      // mb={2}
      px={3}
      py={2}
      mt={2}
      w={"100%"}
      _hover={{
        background: "#3182CE",
        color: "white",
      }}
      borderRadius={"lg"}
    >
      <Avatar size={"sm"} name={user.name} src={user.pic} />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize={"12px"}>
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
