// src/components/Aspirantes.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import API from "../api/authService";

interface Aspirante {
  id: string;
  nombre: string;
  email: string;
  tipoTrabajo: {
    nombre: string;
  };
  mensaje: string;
  cvUrl?: string;
}

const Aspirantes = () => {
  const [aspirantes, setAspirantes] = useState<Aspirante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAspirantes = async () => {
      try {
        const { data } = await API.get("/aspirante"); // Endpoint protegido para ADMIN
        setAspirantes(data);
      } catch (error: any) {
        console.error("Error al cargar aspirantes:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAspirantes();
  }, []);

  if (loading) return <Spinner color="white" />;

  if (aspirantes.length === 0)
    return <Text color="white">No hay aspirantes registrados aún.</Text>;

  return (
    <Box>
      <Heading size="md" mb={4} color="white">
        Aspirantes a trabajar con nosotros
      </Heading>
      <Table variant="simple" colorScheme="purple">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Email</Th>
            <Th>Área</Th>
            <Th>Mensaje</Th>
            <Th>CV</Th>
          </Tr>
        </Thead>
        <Tbody>
          {aspirantes.map((a) => (
            <Tr key={a.id}>
              <Td>{a.nombre}</Td>
              <Td>{a.email}</Td>
              <Td>{a.tipoTrabajo?.nombre || "Sin área"}</Td>
              <Td>{a.mensaje}</Td>
              <Td>
                {a.cvUrl ? (
                  <a href={a.cvUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#90cdf4" }}>
                    Ver CV
                  </a>
                ) : (
                  "Sin archivo"
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Aspirantes;
