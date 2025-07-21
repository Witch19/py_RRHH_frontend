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
  Select,
  Avatar,
} from "@chakra-ui/react";
//import { FaCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authService";
import logoImg from "../assets/Logo.png";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
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

  useEffect(() => {
    const fetchTipoTrabajos = async () => {
      try {
        const res = await API.get("/tipo-trabajo");
        setTipoTrabajos(res.data);
      } catch (error) {
        toast({
          title: "Error al cargar áreas",
          description: "Verifica conexión con el backend",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchTipoTrabajos();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const dataToSend = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        telefono: form.telefono,
        direccion: form.direccion,
        tipoTrabajoId: Number(form.tipoTrabajoId),
      };

      await API.post("/auth/register", dataToSend);

      toast({
        title: "Usuario registrado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.response?.data?.message || "Error interno del servidor",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
                name="username"
                value={form.username}
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
                <option value="ADMIN">ADMIN</option>
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
      </Box>
    </Flex>
  );
};

export default Register;
