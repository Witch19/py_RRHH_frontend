import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authService";
//import { useThemeColor } from "../context/ThemeContext";

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
  //const { gradient } = useThemeColor();

  useEffect(() => {
    const fetchTipoTrabajos = async () => {
      try {
        const res = await API.get("/tipo-trabajo");
        setTipoTrabajos(res.data);
      } catch (error) {
        console.error("Error cargando tipo de trabajos:", error);
      }
    };
    fetchTipoTrabajos();
  }, []);

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
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      toast({
        title: "Error al registrarse",
        description: "No se pudo registrar el usuario",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex align="center" justify="center" minH="100vh" bg="gray.700">
      <Box
        bg="white"
        p={8}
        rounded="md"
        shadow="lg"
        w="100%"
        maxW="400px"
      >
        <VStack as="form" spacing={4} onSubmit={handleSubmit}>
          <Heading size="lg" textAlign="center">
            Sign Up
          </Heading>

          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Apellido</FormLabel>
            <Input
              value={form.apellido}
              onChange={(e) =>
                setForm({ ...form, apellido: e.target.value })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Teléfono</FormLabel>
            <Input
              value={form.telefono}
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Dirección</FormLabel>
            <Input
              value={form.direccion}
              onChange={(e) =>
                setForm({ ...form, direccion: e.target.value })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Área de trabajo</FormLabel>
            <Select
              placeholder="Selecciona área"
              value={form.tipoTrabajoId}
              onChange={(e) =>
                setForm({ ...form, tipoTrabajoId: e.target.value })
              }
            >
              {tipoTrabajos.map((tipo: any) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Rol</FormLabel>
            <Select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="TRABAJADOR">TRABAJADOR</option>
              <option value="ADMIN">ADMIN</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Confirmar contraseña</FormLabel>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </FormControl>

          <Checkbox isRequired>
            Acepto los Términos de servicio y Política de privacidad
          </Checkbox>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
          >
            Registrarse
          </Button>

          <Text fontSize="sm">
            ¿Ya tienes una cuenta?{" "}
            <Link color="blue.500" href="/login">
              Inicia sesión
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Register;
