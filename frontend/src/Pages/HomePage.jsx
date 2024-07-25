import React, { useEffect } from "react";
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import SignUpPage from "../Components/Authentication/SignUpPage";
import { useNavigate } from "react-router-dom";
import { loadData } from "../utils/localStorage";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = loadData("userInfo");
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <>
      <Container maxW={"xl"} centerContent>
        <Box
          justifyContent={"center"}
          bg={"whiteAlpha.600"}
          d="flex"
          w={"100%"}
          m={"40px 0 15px 0"}
          borderRadius={"lg"}
          // borderWidth={"0px"}
        >
          <Text fontSize={"4xl"} fontFamily={"Work sans"} color={"black"}>
            MERN-Chat-App
          </Text>
        </Box>
        <Box
          color={"black"}
          bg={"whiteAlpha.600"}
          // bg={"whiteAlpha.800"}
          w={"100%"}
          p={4}
          borderRadius={"lg"}
        >
          <Tabs
            align="center"
            colorScheme="blue"
            isManual
            variant="soft-rounded"
          >
            <TabList mb={"1em"}>
              <Tab w={"50%"}>Login</Tab>
              <Tab w={"50%"}>SignUp</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUpPage />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
