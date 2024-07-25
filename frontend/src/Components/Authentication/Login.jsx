import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveData } from "../../utils/localStorage";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://mern-chat-app-qm6p.onrender.com/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // localStorage.setItem("userInfo", JSON.stringify(data));
      saveData("userInfo", data);
      setLoading(false);
      navigate("/chats");
    } catch (err) {
      toast({
        title: "Error Occurred",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  
  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <VStack spacing={5}>
          {/* EMAIL */}
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              type={"email"}
              placeholder="Enter Your Email"
            />
          </FormControl>

          {/* PASSWORD */}
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the Password"
                type={showPassword ? "text" : "password"}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {/* BUTTON */}
          <Button
            type="submit"
            w={"100%"}
            isLoading={loading}
            loadingText="Submitting"
            size="md"
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
          >
            Log In
          </Button>
          <Button
            // colorScheme="red"
            w={"100%"}
            size="md"
            bg={"red.400"}
            color={"white"}
            _hover={{
              bg: "red.600",
            }}
            onClick={() => {
              setEmail("guest@example.com");
              setPassword("123456");
            }}
          >
            Get Guest User Credentials
          </Button>
        </VStack>
      </form>
    </>
  );
};

export default Login;
