import {
  Box,
  Button,
  FormControl,
  Input,
  VStack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Text,
  Flex,
  useToast,
  Link,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaUser, FaLock, FaCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authService";
import { useAuth } from "../auth/AuthContext";
import { useThemeColor } from "../context/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();
  const { setTheme } = useThemeColor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await API.post("auth/login", { email, password });
      const { user, token } = res.data;

      if (user && token) {
        login(
          {
            id: user._id || user.id,
            email: user.email,
            username: user.username,
            role: user.role,
          },
          token
        );

        toast({
          title: "¡Bienvenido!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigate("/dashboard");
      } else {
        throw new Error("Respuesta del servidor inválida");
      }
    } catch (err: any) {
      toast({
        title: "Error al iniciar sesión",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="#5C5C77"
      px={4}
    >
      <Box
        bg="whiteAlpha.200"
        backdropFilter="blur(10px)"
        borderRadius="2xl"
        p={8}
        w="full"
        maxW="sm"
        textAlign="center"
        boxShadow="2xl"
      >
        <Box mb={6}>
          <Icon as={FaCircle} boxSize={8} color="white" />
          <Heading size="md" color="white" mt={2}>
            Technology
          </Heading>
        </Box>

        <Heading size="lg" color="white" mb={6}>
          Welcome
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <InputGroup>
                <InputLeftElement>
                  <FaUser color="gray" />
                </InputLeftElement>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username"
                  bg="white"
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <InputGroup>
                <InputLeftElement>
                  <FaLock color="gray" />
                </InputLeftElement>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  bg="white"
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Mostrar/Ocultar contraseña"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Flex w="full" justify="flex-end">
              <Link color="white" fontSize="sm">
                Forgot Password?
              </Link>
            </Flex>

            <Button type="submit" colorScheme="purple" w="full" borderRadius="full">
              Login
            </Button>
          </VStack>
        </form>

        <Text mt={4} color="white" fontSize="sm">
          Don’t have an account?{" "}
          <Link color="blue.200" href="register" fontWeight="bold">
            Sign Up
          </Link>
        </Text>

        <Flex justify="center" gap={4} mt={6}>
          <Icon as={FaCircle} color="gray.300" onClick={() => setTheme("gray")} cursor="pointer" />
          <Icon as={FaCircle} color="orange.400" onClick={() => setTheme("orange")} cursor="pointer" />
          <Icon as={FaCircle} color="teal.400" onClick={() => setTheme("teal")} cursor="pointer" />
        </Flex>
      </Box>
    </Flex>
  );
};

export default Login;
