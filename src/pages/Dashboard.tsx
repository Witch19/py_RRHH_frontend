import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Heading,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
} from "@chakra-ui/react";
//import { FaCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import Trabajadores from "./Trabajadores";
import Cursos from "./Cursos";
import Solicitudes from "./Solicitudes";
import Aspirantes from "./Aspirantes";
import Usuarios from "./Usuarios";
import API from "../api/authService";
//import { useThemeColor } from "../context/ThemeContext";

const Dashboard = () => {
  const { user, logout, login } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [activeMenu, setActiveMenu] = useState(isAdmin ? "trabajadores" : "cursos");

  const menuItems = [
    ...(isAdmin ? [{ key: "trabajadores", label: "Trabajadores" }] : []),
    { key: "cursos", label: "Cursos" },
    { key: "solicitudes", label: "Solicitudes" },
    ...(isAdmin ? [{ key: "aspirantes", label: "Aspirantes" }] : []),
    ...(isAdmin ? [{ key: "usuarios", label: "Usuarios" }] : []),
    { key: "perfil", label: "Editar Perfil" },
  ];

  // const { setTheme } = useThemeColor();
  const toast = useToast();
  const token = localStorage.getItem("token") || "";

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

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

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updateData = { username, email };

      const { data } = await API.put("/auth/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      login(
        { ...data.user, trabajadorId: user?.trabajadorId },
        token
      );

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
    <Flex minH="100vh" bg="#5b5772" overflow="hidden">
      {/* Menú lateral */}
      <Box
        bg="whiteAlpha.200"
        backdropFilter="blur(10px)"
        w="240px"
        p={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        color="white"
      >
        <Box>
          <Heading size="md" mb={6} textAlign="center">
            Menú
          </Heading>
          <VStack spacing={3} align="stretch">
            {menuItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                bg={activeMenu === item.key ? "white" : "transparent"}
                color={activeMenu === item.key ? "black" : "white"}
                _hover={{ bg: "whiteAlpha.300" }}
                justifyContent="flex-start"
                onClick={() => setActiveMenu(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </VStack>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
        <Flex
          bg="whiteAlpha.100"
          backdropFilter="blur(6px)"
          p={4}
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid"
          borderColor="whiteAlpha.300"
          color="white"
        >
          <Text fontWeight="medium">
            Hola, {user ? user.username ?? user.email ?? "Invitado" : "Invitado"}
          </Text>
          <Button size="sm" colorScheme="red" onClick={logout}>
            Cerrar sesión
          </Button>
        </Flex>

        <Box p={6} flex="1" overflow="hidden" color="white" bg="#5b5772">
          {activeMenu === "trabajadores" && isAdmin && <Trabajadores />}
          {activeMenu === "cursos" && <Cursos />}
          {activeMenu === "solicitudes" && <Solicitudes />}
          {activeMenu === "aspirantes" && isAdmin && <Aspirantes />}
          {activeMenu === "usuarios" && isAdmin && <Usuarios />}
          {activeMenu === "perfil" &&
            (profileLoading ? (
              <Spinner color="white" />
            ) : (
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
                      bg="white"
                      color="gray.800"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Correo electrónico"
                      bg="white"
                      color="gray.800"
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
            ))}
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
