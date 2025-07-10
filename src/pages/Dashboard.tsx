import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  Heading,
  useColorModeValue,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import Trabajadores from "./Trabajadores";
import Cursos from "./Cursos";
import Solicitudes from "./Solicitudes";
import API from "../api/authService";

const menuItems = [
  { key: "trabajadores", label: "Trabajadores" },
  { key: "cursos", label: "Cursos" },
  { key: "solicitudes", label: "Solicitudes" },
  { key: "perfil", label: "Editar Perfil" },
];

const Dashboard = () => {
  const { user, logout, login } = useAuth();
  const [activeMenu, setActiveMenu] = useState("trabajadores");

  const bgSidebar = useColorModeValue("gray.100", "gray.900");
  const bgHeader = useColorModeValue("white", "gray.800");

  // Estado para formulario perfil
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
      } catch (error: any) {
        console.error("Error al obtener perfil:", error.response?.data || error.message);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";

      const res = await API.put(
        "/auth/profile",
        { username, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      login(res.data.user, token); // Actualiza contexto usuario

      toast({
        title: "Perfil actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error al actualizar perfil",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex height="100vh" overflow="hidden">
      {/* Sidebar */}
      <Box
        bg={bgSidebar}
        w="220px"
        p={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100vh"
      >
        <Box>
          <Heading size="md" mb={6} textAlign="center">
            Menú
          </Heading>
          <VStack spacing={3} align="stretch">
            {menuItems.map((item) => (
              <Button
                key={item.key}
                variant={activeMenu === item.key ? "solid" : "ghost"}
                colorScheme="blue"
                justifyContent="flex-start"
                onClick={() => setActiveMenu(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </VStack>
        </Box>

        <Box>
          <Button colorScheme="red" size="sm" onClick={logout} width="100%">
            Cerrar sesión
          </Button>
        </Box>
      </Box>

      {/* Main content */}
      <Box flex="1" display="flex" flexDirection="column" overflow="auto">
        {/* Header */}
        <Flex
          bg={bgHeader}
          p={4}
          justifyContent="flex-end"
          alignItems="center"
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <Text fontWeight="medium" mr={4}>
            Hola, {user ? user.username ?? user.email ?? "Invitado" : "Invitado"}
          </Text>
        </Flex>

        {/* Contenido dinámico */}
        <Box p={6} flex="1" overflowY="auto">
          {activeMenu === "trabajadores" && <Trabajadores />}
          {activeMenu === "cursos" && <Cursos />}
          {activeMenu === "solicitudes" && <Solicitudes />}
          {activeMenu === "perfil" && (
            <Box maxW="400px">
              <Heading size="md" mb={4}>
                Editar perfil
              </Heading>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nombre de usuario"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                  />
                </FormControl>
                <Button
                  colorScheme="blue"
                  onClick={handleUpdateProfile}
                  isLoading={loading}
                  alignSelf="flex-start"
                >
                  Guardar cambios
                </Button>
              </VStack>
            </Box>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
