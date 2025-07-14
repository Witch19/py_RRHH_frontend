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
  IconButton,
  Tooltip,
  Stack,
  Checkbox,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, CheckIcon } from "@chakra-ui/icons";
import { useThemeColor } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthContext";
import AgregarCurso, { type Curso } from "../components/AgregarCursos";
import EditarCursos from "../components/EditarCursos";

/* ---------- Botones con íconos estilizados ---------- */
const BtnEditar = (props: any) => (
  <IconButton
    icon={<EditIcon />}
    aria-label="Editar"
    size="sm"
    bg="gray.100"
    _hover={{ bg: "gray.200" }}
    {...props}
  />
);

const BtnEliminar = (props: any) => (
  <IconButton
    icon={<DeleteIcon />}
    aria-label="Eliminar"
    size="sm"
    bg="red.400"
    color="white"
    _hover={{ bg: "red.500" }}
    {...props}
  />
);

const Cursos = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toast = useToast();
  const { gradient } = useThemeColor();
  const { user } = useAuth();
  const isAdmin = (user?.role || "").toString().toLowerCase() === "admin";

  const {
    isOpen: isEditOpen,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/curso");
        setCursos(data);
      } catch (err: any) {
        toast({
          title: "Error al cargar cursos",
          description: err.response?.data?.message || err.message,
          status: "error",
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const handleInscribir = async () => {
    if (selectedIds.size === 0) {
      toast({ title: "Selecciona cursos", status: "info", duration: 2500 });
      return;
    }
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) => API.post(`/curso/${id}/inscribir`))
      );
      toast({ title: "Inscripción exitosa", status: "success", duration: 2500 });
      setSelectedIds(new Set());
    } catch (err: any) {
      toast({
        title: "Error al inscribirte",
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
    <>
      <Box p={6} bgGradient={gradient} borderRadius="lg" boxShadow="lg" color="white">
        {/* Encabezado */}
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Heading mb={0}>
            Lista de Cursos{" "}
            <Badge colorScheme="blue" fontSize="0.8em">
              {cursos.length}
            </Badge>
          </Heading>

          {/* Botón Agregar */}
          {isAdmin && (
            <AgregarCurso
              onAdd={(nuevo) => setCursos((prev) => [...prev, nuevo])}
              triggerButton={
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="green"
                  size="md"
                  borderRadius="md"
                  fontWeight="bold"
                >
                  Agregar
                </Button>
              }
            />
          )}
        </Box>

        {/* Tabla */}
        <Table variant="simple" size="md" bg="white" color="gray.800" borderRadius="md">
          <Thead bg="gray.100">
            <Tr>
              {!isAdmin && <Th textAlign="center">Seleccionar</Th>}
              <Th>Nombre</Th>
              <Th>Descripción</Th>
              <Th>Duración</Th>
              <Th>Áreas</Th>
              {isAdmin && <Th textAlign="center">Acciones</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {cursos.length === 0 ? (
              <Tr>
                <Td colSpan={isAdmin ? 6 : 5}>
                  <Center py={4}>No hay cursos registrados</Center>
                </Td>
              </Tr>
            ) : (
              cursos.map((curso) => (
                <Tr key={curso.id}>
                  {!isAdmin && (
                    <Td textAlign="center">
                      <Checkbox
                        isChecked={selectedIds.has(curso.id!)}
                        onChange={(e) => {
                          const set = new Set(selectedIds);
                          e.target.checked ? set.add(curso.id!) : set.delete(curso.id!);
                          setSelectedIds(set);
                        }}
                      />
                    </Td>
                  )}
                  <Td>{curso.nombre}</Td>
                  <Td>{curso.descripcion}</Td>
                  <Td>{curso.duracion}</Td>
                  <Td>
                    <Wrap>
                      {curso.areas?.length ? (
                        curso.areas.map((a, i) => (
                          <WrapItem key={i}>
                            <Tag size="sm" colorScheme="green">
                              {a}
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
                    <Td textAlign="center">
                      <Stack direction="row" spacing={2} justify="center">
                        <Tooltip label="Editar">
                          <BtnEditar
                            onClick={() => {
                              setEditingCurso(curso);
                              openEdit();
                            }}
                          />
                        </Tooltip>
                        <Tooltip label="Eliminar">
                          <BtnEliminar
                            onClick={async () => {
                              try {
                                await API.delete(`/curso/${curso.id}`);
                                setCursos((prev) =>
                                  prev.filter((c) => c.id !== curso.id)
                                );
                                toast({
                                  title: "Curso eliminado",
                                  status: "success",
                                  duration: 2000,
                                });
                              } catch (err: any) {
                                toast({
                                  title: "Error al eliminar",
                                  description:
                                    err.response?.data?.message || err.message,
                                  status: "error",
                                  duration: 4000,
                                });
                              }
                            }}
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

      {/* Botón de inscripción */}
      {!isAdmin && cursos.length > 0 && (
        <Box position="fixed" bottom="24px" right="24px" zIndex={1000}>
          <Button
            colorScheme="green"
            size="lg"
            borderRadius="full"
            px={6}
            shadow="lg"
            leftIcon={<CheckIcon />}
            onClick={handleInscribir}
            isDisabled={selectedIds.size === 0}
          >
            Inscribirme
          </Button>
        </Box>
      )}

      {/* Modal de edición */}
      {isAdmin && (
        <EditarCursos
          isOpen={isEditOpen}
          onClose={closeEdit}
          curso={editingCurso}
          onUpdate={(updated) => {
            setCursos((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            );
          }}
          onDelete={(id) => {
            setCursos((prev) => prev.filter((c) => c.id !== id));
          }}
        />
      )}
    </>
  );
};

export default Cursos;