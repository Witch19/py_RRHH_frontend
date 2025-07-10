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
} from "@chakra-ui/react";

interface Trabajador {
  _id?: string;
  nombre: string;
  correo: string;
  area: string;
}

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/trabajador"); // El token se inyecta automáticamente
        setTrabajadores(res.data);
      } catch (err: any) {
        console.error("Error al cargar trabajadores:", err);
        setError(
          err.response?.data?.message || "Error al cargar trabajadores"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Text>Cargando trabajadores...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box p={6}>
      <Heading mb={4}>Lista de Trabajadores</Heading>
      <Table variant="striped" colorScheme="blue" size="md">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Correo</Th>
            <Th>Área</Th>
          </Tr>
        </Thead>
        <Tbody>
          {trabajadores.length === 0 ? (
            <Tr>
              <Td colSpan={3}>
                <Center>No hay trabajadores registrados</Center>
              </Td>
            </Tr>
          ) : (
            trabajadores.map((t, index) => (
              <Tr key={t._id ?? index}>
                <Td>{t.nombre}</Td>
                <Td>{t.correo}</Td>
                <Td>{t.area}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Trabajadores;