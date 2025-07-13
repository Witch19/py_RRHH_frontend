import { useEffect, useState } from "react";
import API from "../api/authService";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  Badge,
  Tag,
  Spinner,
  useToast,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useThemeColor } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthContext";

interface Solicitud {
  _id: string;
  trabajadorNombre: string;
  permisoTipo: string;
  descripcion: string;
  fechaSolicitud: string;
  estado?: string;
}

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { gradient } = useThemeColor();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const res = await API.get("/solicitudes");
        setSolicitudes(res.data);
      } catch (err: any) {
        toast({
          title: "Error al cargar solicitudes",
          description: err.response?.data?.message || err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitudes();
  }, [toast]);

  const handleEliminar = async (id: string) => {
    try {
      await API.delete(`/solicitudes/${id}`);
      setSolicitudes((prev) => prev.filter((s) => s._id !== id));
      toast({
        title: "Solicitud eliminada",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Error al eliminar solicitud",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading)
    return (
      <Center minH="200px">
        <Spinner size="lg" color="white" />
      </Center>
    );

  return (
    <Box
      p={6}
      bgGradient={gradient}
      borderRadius="lg"
      boxShadow="lg"
      color="white"
    >
      <Heading mb={4} display="flex" alignItems="center" gap={3}>
        Solicitudes{" "}
        <Badge colorScheme="purple" fontSize="0.9em">
          {solicitudes.length}
        </Badge>
      </Heading>

      <Table variant="simple" size="md" bg="white" color="gray.800" borderRadius="md">
        <Thead bg="gray.100">
          <Tr>
            <Th>Trabajador</Th>
            <Th>Tipo de Permiso</Th>
            <Th>Descripción</Th>
            <Th>Fecha</Th>
            <Th>Estado</Th>
            {isAdmin && <Th>Acciones</Th>}
          </Tr>
        </Thead>

        <Tbody>
          {solicitudes.length === 0 ? (
            <Tr>
              <Td colSpan={isAdmin ? 6 : 5}>
                <Center py={4}>No hay solicitudes registradas</Center>
              </Td>
            </Tr>
          ) : (
            solicitudes.map((solicitud) => (
              <Tr key={solicitud._id}>
                <Td>{solicitud.trabajadorNombre}</Td>
                <Td>{solicitud.permisoTipo}</Td>
                <Td>{solicitud.descripcion}</Td>
                <Td>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</Td>
                <Td>
                  <Tag
                    colorScheme={
                      solicitud.estado === "aprobado"
                        ? "green"
                        : solicitud.estado === "rechazado"
                        ? "red"
                        : "yellow"
                    }
                  >
                    {solicitud.estado || "Pendiente"}
                  </Tag>
                </Td>
                {isAdmin && (
                  <Td>
                    <Tooltip label="Eliminar">
                      <IconButton
                        aria-label="Eliminar solicitud"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleEliminar(solicitud._id)}
                      />
                    </Tooltip>
                  </Td>
                )}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Solicitudes;
