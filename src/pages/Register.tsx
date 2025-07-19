import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Icon,
  Select,
  Avatar,
} from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authService";
import { useThemeColor } from "../context/ThemeContext";
import logoImg from "../assets/Logo.png";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "trabajador",
  });

  const navigate = useNavigate();
  const toast = useToast();
  const { setTheme } = useThemeColor();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        username: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      const mensaje =
        typeof res.data === "string"
          ? res.data
          : res.data?.message || "Usuario registrado correctamente";

      const token =
        typeof res.data === "object" && res.data?.token
          ? res.data.token
          : null;

      if (token) {
        localStorage.setItem("token", token);
      }

      toast({
        title: mensaje,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      toast({
        title: "Error al registrarse",
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
      bgGradient="linear(to-br, #1A3A5E, #2CA6A4)"
      px={4}
    >
      <Box
        bg="whiteAlpha.200"
        backdropFilter="blur(15px)"
        borderRadius="2xl"
        p={8}
        w="full"
        maxW="sm"
        textAlign="center"
        boxShadow="dark-lg"
        color="white"
      >
        <Avatar
          src={logoImg}
          size="xl"
          border="4px solid white"
          bg="white"
          mx="auto"
          mb={6}
        />

        <Heading size="lg" mb={6}>
          Sign Up
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <Input
                placeholder="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                bg="white"
                color="gray.800"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>

            <FormControl isRequired>
              <Input
                placeholder="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                bg="white"
                color="gray.800"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>

            <FormControl isRequired>
              <Input
                type="email"
                placeholder="Your Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                bg="white"
                color="gray.800"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>

            <FormControl isRequired>
              <Select
                placeholder="Seleccione un rol"
                name="role"
                value={form.role}
                onChange={handleChange}
                bg="white"
                color="gray.800"
              >
                <option value="trabajador">Trabajador</option>
                <option value="supervisor">Supervisor</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                bg="white"
                color="gray.800"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>

            <FormControl isRequired>
              <Input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                bg="white"
                color="gray.800"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>

            <Checkbox color="white" alignSelf="start" isRequired>
              I agree to the Terms of Service and Privacy Policy
            </Checkbox>

            <Button
              type="submit"
              bg="purple.500"
              color="white"
              _hover={{ bg: "purple.600" }}
              w="full"
              borderRadius="full"
            >
              Register
            </Button>
          </VStack>
        </form>

        <Text mt={4} fontSize="sm">
          Already have an account?{" "}
          <Link color="blue.200" href="/" fontWeight="bold">
            Login
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

export default Register;
