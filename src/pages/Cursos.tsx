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
  Wrap,
  WrapItem,
  Tag,
} from "@chakra-ui/react";

interface Curso {
  _id?: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  areas: string[];
}

const Cursos = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await API.get("/curso");
        setCursos(res.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar cursos");
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  if (loading) return <Text>Cargando cursos...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box p={6}>
      <Heading mb={2} display="flex" alignItems="center" gap={3}>
        Cursos <Badge colorScheme="blue" fontSize="0.9em">{cursos.length}</Badge>
      </Heading>

      <Table variant="striped" colorScheme="teal" size="md">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Descripción</Th>
            <Th>Duración</Th>
            <Th>Áreas</Th>
          </Tr>
        </Thead>
        <Tbody>
          {cursos.length === 0 ? (
            <Tr>
              <Td colSpan={4}>
                <Center>No hay cursos registrados</Center>
              </Td>
            </Tr>
          ) : (
            cursos.map((curso, index) => (
              <Tr key={curso._id ?? index}>
                <Td>{curso.nombre}</Td>
                <Td>{curso.descripcion}</Td>
                <Td>{curso.duracion}</Td>
                <Td>
                  <Wrap>
                    {curso.areas && curso.areas.length > 0 ? (
                      curso.areas.map((area, i) => (
                        <WrapItem key={`${area}-${i}`}>
                          <Tag size="sm" colorScheme="green">
                            {area}
                          </Tag>
                        </WrapItem>
                      ))
                    ) : (
                      <Text fontSize="sm" color="gray.500">
                        Sin áreas asignadas
                      </Text>
                    )}
                  </Wrap>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Cursos;
