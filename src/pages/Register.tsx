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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authService";
import { useThemeColor } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthContext";
import logoImg from "../assets/Logo.png";

const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "TRABAJADOR",
    telefono: "",
    direccion: "",
    tipoTrabajoId: "",
  });

  const [tipoTrabajos, setTipoTrabajos] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const { setTheme } = useThemeColor();
  const { login } = useAuth();

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const { data } = await API.get("/tipo-trabajo");
        setTipoTrabajos(data);
      } catch (err: any) {
        toast({
          title: "Error al cargar áreas",
          description: err.response?.data?.message || err.message,
          status: "error",
        });
      }
    };
    fetchTipos();
  }, [toast]);

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
      const payload: any = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        role: form.role.toUpperCase(),
        telefono: form.telefono,
        direccion: form.direccion,
      };

      if (form.tipoTrabajoId) {
        payload.tipoTrabajoId = Number(form.tipoTrabajoId);
      }

      await API.post("/auth/register", payload);

      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { token, user } = res.data;

      if (token) {
        login(user, token);
      }

      toast({
        title: `Bienvenido, ${user.username}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/");
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
      bg="#5C5C77" // ← fondo morado como en la segunda imagen
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
        <Avatar src={logoImg} size="xl" mx="auto" mb={6} />

        <Heading size="lg" mb={6}>
          Sign Up
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <Input
                placeholder="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                bg="white"
                color="gray.800"
              />
            </FormControl>

            <FormControl isRequired>
              <Input
                placeholder="Apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                bg="white"
                color="gray.800"
              />
            </FormControl>

            <FormControl isRequired>
              <Input
                type="email"
                placeholder="Correo electrónico"
                name="email"
                value={form.email}
                onChange={handleChange}
                bg="white"
                color="gray.800"
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                bg="white"
                color="gray.800"
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                bg="white"
                color="gray.800"
              />
            </FormControl>

            <FormControl isRequired>
              <Select
                placeholder="Área de trabajo"
                name="tipoTrabajoId"
                value={form.tipoTrabajoId}
                onChange={handleChange}
                bg="white"
                color="gray.800"
              >
                {tipoTrabajos.map((tt: any) => (
                  <option key={tt.id} value={tt.id}>
                    {tt.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <Select
                name="role"
                value={form.role}
                onChange={handleChange}
                bg="white"
                color="gray.800"
              >
                <option value="TRABAJADOR">TRABAJADOR</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <Input
                type="password"
                placeholder="Contraseña"
                name="password"
                value={form.password}
                onChange={handleChange}
                bg="white"
                color="gray.800"
              />
            </FormControl>

            <FormControl isRequired>
              <Input
                type="password"
                placeholder="Confirmar contraseña"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                bg="white"
                color="gray.800"
              />
            </FormControl>

            <Checkbox color="white" alignSelf="start" isRequired>
              Acepto los Términos de servicio y Política de privacidad
            </Checkbox>

            <Button
              type="submit"
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              w="full"
              borderRadius="full"
            >
              Registrarse
            </Button>
          </VStack>
        </form>

        <Text mt={4} fontSize="sm">
          ¿Ya tienes una cuenta?{" "}
          <Link color="blue.200" href="/login" fontWeight="bold">
            Inicia sesión
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
