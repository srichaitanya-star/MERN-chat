import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      borderRadius={"lg"}
      variant={"solid"}
      fontSize={"12px"}
      colorScheme="purple"
      cursor={"pointer"}
      px={2}
      m={1}
      display={"flex"}
      justifyContent={"space-evenly"}
      alignItems={"center"}
      w={"-webkit-fit-content"}
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;
