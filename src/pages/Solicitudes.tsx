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
  Text,
  Center,
  Badge,
  Tag,
} from "@chakra-ui/react";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const res = await API.get("/solicitudes");
        setSolicitudes(res.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar solicitudes");
        setLoading(false);
      }
    };
    fetchSolicitudes();
  }, []);

  if (loading) return <Text>Cargando solicitudes...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box p={6}>
      <Heading mb={2} display="flex" alignItems="center" gap={3}>
        Solicitudes <Badge colorScheme="purple" fontSize="0.9em">{solicitudes.length}</Badge>
      </Heading>

      <Table variant="striped" colorScheme="purple" size="md">
        <Thead>
          <Tr>
            <Th>Trabajador</Th>
            <Th>Tipo de Permiso</Th>
            <Th>Descripción</Th>
            <Th>Fecha</Th>
            <Th>Estado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {solicitudes.length === 0 ? (
            <Tr>
              <Td colSpan={5}>
                <Center>No hay solicitudes registradas</Center>
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
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Solicitudes;
