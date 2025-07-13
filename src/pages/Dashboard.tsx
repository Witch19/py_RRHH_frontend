import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Heading,
  useColorModeValue,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import Trabajadores from "./Trabajadores";
import Cursos from "./Cursos";
import Solicitudes from "./Solicitudes";
import API from "../api/authService";
import { useThemeColor } from "../context/ThemeContext";

const menuItems = [
  { key: "trabajadores", label: "Trabajadores" },
  { key: "cursos", label: "Cursos" },
  { key: "solicitudes", label: "Solicitudes" },
  { key: "perfil", label: "Editar Perfil" },
];

const Dashboard = () => {
  const { user, logout, login } = useAuth();
  const [activeMenu, setActiveMenu] = useState("trabajadores");

  /* Theme */
  const { gradient, setTheme } = useThemeColor();

  /* Sidebar/header colors (sobre el gradient) */
  const bgSidebar = useColorModeValue("whiteAlpha.200", "whiteAlpha.200");
  const bgHeader = useColorModeValue("whiteAlpha.100", "whiteAlpha.100");

  /* Perfil */
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const toast = useToast();
  const token = localStorage.getItem("token") || "";

  /* Obtener perfil */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(data.username || "");
        setEmail(data.email || "");
      } catch (error: any) {
        console.error("Error al obtener perfil:", error.response?.data || error.message);
      } finally {
        setProfileLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  /* Actualizar perfil */
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { data } = await API.put(
        "/auth/profile",
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login(data.user, token); // Actualiza contexto
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
    <Flex minH="100vh" bgGradient={gradient} overflow="hidden">
      {/* ────────────── Sidebar ────────────── */}
      <Box
        bg={bgSidebar}
        backdropFilter="blur(10px)"
        w="240px"
        p={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {/* Menú principal */}
        <Box>
          <Heading size="md" mb={6} textAlign="center" color="white">
            Menú
          </Heading>
          <VStack spacing={3} align="stretch">
            {menuItems.map((item) => (
              <Button
                key={item.key}
                variant={activeMenu === item.key ? "solid" : "ghost"}
                colorScheme="purple"
                justifyContent="flex-start"
                onClick={() => setActiveMenu(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </VStack>
        </Box>

        {/* Selector de color + Logout */}
        <VStack spacing={4}>
          <Flex justify="center" gap={3}>
            <Icon
              as={FaCircle}
              color="gray.300"
              cursor="pointer"
              onClick={() => setTheme("gray")}
            />
            <Icon
              as={FaCircle}
              color="orange.400"
              cursor="pointer"
              onClick={() => setTheme("orange")}
            />
            <Icon
              as={FaCircle}
              color="teal.400"
              cursor="pointer"
              onClick={() => setTheme("teal")}
            />
          </Flex>
          <Button colorScheme="red" size="sm" onClick={logout} width="100%">
            Cerrar sesión
          </Button>
        </VStack>
      </Box>

      {/* ────────────── Contenido ────────────── */}
      <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
        {/* Header */}
        <Flex
          bg={bgHeader}
          backdropFilter="blur(6px)"
          p={4}
          justifyContent="flex-end"
          alignItems="center"
          borderBottom="1px solid"
          borderColor="whiteAlpha.300"
        >
          <Text fontWeight="medium" color="white">
            Hola, {user ? user.username ?? user.email ?? "Invitado" : "Invitado"}
          </Text>
        </Flex>

        {/* Contenido dinámico */}
        <Box p={6} flex="1" overflowY="auto">
          {activeMenu === "trabajadores" && <Trabajadores />}
          {activeMenu === "cursos" && <Cursos />}
          {activeMenu === "solicitudes" && <Solicitudes />}
          {activeMenu === "perfil" && (
            profileLoading ? (
              <Spinner color="white" />
            ) : (
              <Box maxW="400px">
                <Heading size="md" mb={4} color="white">
                  Editar perfil
                </Heading>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel color="white">Nombre de usuario</FormLabel>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nombre de usuario"
                      bg="white"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color="white">Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Correo electrónico"
                      bg="white"
                    />
                  </FormControl>
                  <Button
                    colorScheme="purple"
                    onClick={handleUpdateProfile}
                    isLoading={loading}
                    alignSelf="flex-start"
                  >
                    Guardar cambios
                  </Button>
                </VStack>
              </Box>
            )
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
