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
  Stack,
  Text,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { useThemeColor } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthContext";

interface Solicitud {
  id: string;
  tipo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  trabajadorId: number;
  trabajador?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    direccion?: string;
    area?: string;
  };
}

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { gradient } = useThemeColor();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

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

  const actualizarEstado = async (id: string, estado: string) => {
    try {
      const estadoMayuscula = estado.toUpperCase();
      await API.put(`/solicitudes/${id}`, { estado: estadoMayuscula });

      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: estadoMayuscula } : s))
      );

      toast({
        title: `Solicitud ${estadoMayuscula}`,
        status: "success",
        duration: 2000,
      });
    } catch (err: any) {
      toast({
        title: "Error al actualizar estado",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
      });
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await API.delete(`/solicitudes/${id}`);
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "Solicitud eliminada",
        status: "success",
        duration: 2000,
      });
    } catch (err: any) {
      toast({
        title: "Error al eliminar",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
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
    <Box p={6} bgGradient={gradient} borderRadius="lg" boxShadow="lg" color="white">
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
            <Th>Tipo</Th>
            <Th>Descripción</Th>
            <Th>Fecha</Th>
            <Th>Estado</Th>
            {isAdmin && <Th>Acciones</Th>}
          </Tr>
        </Thead>

        <Tbody>
          {solicitudes.length === 0 ? (
            <Tr>
              <Td colSpan={6}>
                <Center py={4}>No hay solicitudes registradas</Center>
              </Td>
            </Tr>
          ) : (
            solicitudes.map((s) => (
              <Tr key={s.id}>
                <Td>
                  {s.trabajador ? (
                    <Box>
                      <Text fontWeight="bold">
                        {s.trabajador.nombre} {s.trabajador.apellido}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {s.trabajador.email}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Área: {s.trabajador.area || "-"}
                      </Text>
                    </Box>
                  ) : (
                    <Text>ID Trabajador: {s.trabajadorId}</Text>
                  )}
                </Td>
                <Td>{s.tipo}</Td>
                <Td>{s.descripcion}</Td>
                <Td>
                  {new Date(s.fechaInicio).toLocaleDateString()} -{" "}
                  {new Date(s.fechaFin).toLocaleDateString()}
                </Td>
                <Td>
                  <Tag
                    colorScheme={
                      s.estado === "APROBADO"
                        ? "green"
                        : s.estado === "RECHAZADO"
                        ? "red"
                        : "yellow"
                    }
                  >
                    {s.estado}
                  </Tag>
                </Td>
                {isAdmin && (
                  <Td>
                    <Stack direction="row" spacing={1}>
                      <Tooltip label="Aprobar">
                        <IconButton
                          icon={<CheckIcon />}
                          aria-label="Aprobar"
                          colorScheme="green"
                          size="sm"
                          onClick={() => actualizarEstado(s.id, "APROBADO")}
                        />
                      </Tooltip>
                      <Tooltip label="Rechazar">
                        <IconButton
                          icon={<CloseIcon />}
                          aria-label="Rechazar"
                          colorScheme="red"
                          size="sm"
                          onClick={() => actualizarEstado(s.id, "RECHAZADO")}
                        />
                      </Tooltip>
                    </Stack>
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
