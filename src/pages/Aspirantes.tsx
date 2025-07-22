// src/pages/ListaAspirantes.tsx
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useColorModeValue,
  Icon,
  Link,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import API from "../api/authService";
import { useAuth } from "../auth/AuthContext";
import { AttachmentIcon, DeleteIcon } from "@chakra-ui/icons";
import ModalAgregarAspirante from "../components/ModalAgregarAspirante"; // asegúrate de que el path sea correcto

interface Aspirante {
  _id: string;
  nombre: string;
  email: string;
  mensaje?: string;
  cvUrl?: string;
  tipoTrabajo?: {
    nombre: string;
  };
}

const ListaAspirantes = () => {
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [aspirantes, setAspirantes] = useState<Aspirante[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef(null);
  const [aspiranteAEliminar, setAspiranteAEliminar] = useState<string | null>(null);

  const cargarAspirantes = async () => {
    try {
      const res = await API.get("/aspirante");
      console.log("📄 Aspirantes:", res.data);
      setAspirantes(res.data);
    } catch (err) {
      toast({
        title: "Error al cargar aspirantes",
        status: "error",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      cargarAspirantes();
    }
  }, [isAdmin]);

  const confirmarEliminar = (id: string) => {
    setAspiranteAEliminar(id);
    setIsAlertOpen(true);
  };

  const eliminarAspirante = async () => {
    if (!aspiranteAEliminar) return;
    try {
      await API.delete(`/aspirante/${aspiranteAEliminar}`);
      setAspirantes((prev) => prev.filter((a) => a._id !== aspiranteAEliminar));
      toast({
        title: "Aspirante eliminado",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error al eliminar aspirante",
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsAlertOpen(false);
      setAspiranteAEliminar(null);
    }
  };

  return (
    <Box mt={8}>
      {isAdmin && (
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Lista de Aspirantes</Text>
          <ModalAgregarAspirante onAdd={cargarAspirantes} />
        </Flex>
      )}

      {isAdmin && aspirantes.length > 0 ? (
        <Box
          borderRadius="lg"
          overflowX="auto"
          boxShadow="md"
          bg={useColorModeValue("white", "gray.800")}
        >
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th color="black">NOMBRE</Th>
                <Th color="black">EMAIL</Th>
                <Th color="black">ÁREA</Th>
                <Th color="black">MENSAJE</Th>
                <Th color="black">CV</Th>
                <Th color="black">ACCIONES</Th>
              </Tr>
            </Thead>
            <Tbody>
              {aspirantes.map((a) => (
                <Tr key={a._id}>
                  <Td color="black">{a.nombre}</Td>
                  <Td color="black">{a.email}</Td>
                  <Td color="black">{a.tipoTrabajo?.nombre}</Td>
                  <Td color="black">{a.mensaje || "—"}</Td>
                  <Td>
                    {a.cvUrl ? (
                      <Link
                        href={a.cvUrl}
                        isExternal
                        color="blue.500"
                        fontWeight="semibold"
                        display="flex"
                        alignItems="center"
                        _hover={{ textDecoration: "underline" }}
                      >
                        <Icon as={AttachmentIcon} mr={1} /> Ver CV
                      </Link>
                    ) : (
                      <Text color="gray.400">Sin archivo</Text>
                    )}
                  </Td>
                  <Td>
                    <Button
                      onClick={() => confirmarEliminar(a._id)}
                      colorScheme="red"
                      size="sm"
                      borderRadius="lg"
                      leftIcon={<DeleteIcon />}
                    >
                      Eliminar
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Text mt={4} color="gray.500" fontWeight="medium" textAlign="center">
          No hay postulaciones registradas.
        </Text>
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Aspirante
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar este aspirante? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={eliminarAspirante} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ListaAspirantes;
