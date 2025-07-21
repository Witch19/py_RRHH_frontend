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
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import API from "../api/authService";
import { useAuth } from "../auth/AuthContext";
import { DeleteIcon } from "@chakra-ui/icons";

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

const ModalAgregarAspirante = () => {
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [aspirantes, setAspirantes] = useState<Aspirante[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef(null);
  const [aspiranteAEliminar, setAspiranteAEliminar] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      API.get("/aspirante").then((res) => setAspirantes(res.data));
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
      {isAdmin && aspirantes.length > 0 ? (
        <Box
          borderRadius="lg"
          overflowX="auto"
          boxShadow="md"
          bg={useColorModeValue("white", "gray.800")}
        >
          <Table variant="simple" colorScheme="teal">
            <Thead bg={useColorModeValue("gray.100", "gray.700")}>
              <Tr>
                <Th color={useColorModeValue("gray.700", "gray.300")}>NOMBRE</Th>
                <Th color={useColorModeValue("gray.700", "gray.300")}>EMAIL</Th>
                <Th color={useColorModeValue("gray.700", "gray.300")}>ÁREA</Th>
                <Th color={useColorModeValue("gray.700", "gray.300")}>MENSAJE</Th>
                <Th color={useColorModeValue("gray.700", "gray.300")}>CV</Th>
                <Th color={useColorModeValue("gray.700", "gray.300")}>ACCIONES</Th>
              </Tr>
            </Thead>
            <Tbody>
              {aspirantes.map((a) => (
                <Tr key={a._id}>
                  <Td color={useColorModeValue("gray.800", "gray.200")}>{a.nombre}</Td>
                  <Td color={useColorModeValue("gray.800", "gray.200")}>{a.email}</Td>
                  <Td color={useColorModeValue("gray.800", "gray.200")}>{a.tipoTrabajo?.nombre}</Td>
                  <Td color={useColorModeValue("gray.800", "gray.200")}>{a.mensaje}</Td>
                  <Td>
                    {a.cvUrl ? (
                      <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/uploads/cv/${a.cvUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3182ce", fontWeight: "bold" }}
                      >
                        Ver CV
                      </a>
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
                      {/* Puedes dejar vacío para solo ícono */}
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

      {/* Confirmación de eliminación */}
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

export default ModalAgregarAspirante;
