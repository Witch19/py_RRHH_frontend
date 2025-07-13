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
  Spinner,
  useToast,
  Button,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useThemeColor } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthContext";

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
  const toast = useToast();
  const { gradient } = useThemeColor();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await API.get("/curso");
        setCursos(res.data);
      } catch (err: any) {
        toast({
          title: "Error al cargar cursos",
          description: err.response?.data?.message || err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, [toast]);

  const handleEliminar = async (id: string | undefined) => {
    if (!id) return;
    try {
      await API.delete(`/curso/${id}`);
      setCursos((prev) => prev.filter((c) => c._id !== id));
      toast({
        title: "Curso eliminado",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Error al eliminar curso",
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
        Cursos{" "}
        <Badge colorScheme="blue" fontSize="0.9em">
          {cursos.length}
        </Badge>
      </Heading>

      {isAdmin && (
        <Button colorScheme="green" mb={4}>
          Agregar Curso
        </Button>
      )}

      <Table variant="simple" size="md" bg="white" color="gray.800" borderRadius="md">
        <Thead bg="gray.100">
          <Tr>
            <Th>Nombre</Th>
            <Th>Descripción</Th>
            <Th>Duración</Th>
            <Th>Áreas</Th>
            {isAdmin && <Th>Acciones</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {cursos.length === 0 ? (
            <Tr>
              <Td colSpan={isAdmin ? 5 : 4}>
                <Center py={4}>No hay cursos registrados</Center>
              </Td>
            </Tr>
          ) : (
            cursos.map((curso) => (
              <Tr key={curso._id}>
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
                {isAdmin && (
                  <Td>
                    <Tooltip label="Eliminar">
                      <IconButton
                        aria-label="Eliminar curso"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleEliminar(curso._id)}
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

export default Cursos;
