import React, { useEffect, useState } from 'react';
import API from '../api/authService';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Badge,
} from '@chakra-ui/react';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  CheckIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';
import AgregarCurso, { type Curso } from '../components/AgregarCursos';
import EditarCursos from '../components/EditarCursos';

type CursoInscrito = Curso & { relacionId: number };

export const BtnEditar = React.forwardRef(
  (props: any, ref: React.Ref<HTMLButtonElement>) => (
    <IconButton
      icon={<EditIcon />}
      aria-label="Editar"
      size="sm"
      bg="gray.100"
      _hover={{ bg: 'gray.200' }}
      ref={ref}
      {...props}
    />
  ),
);

export const BtnEliminar = React.forwardRef(
  (props: any, ref: React.Ref<HTMLButtonElement>) => (
    <IconButton
      icon={<DeleteIcon />}
      aria-label="Eliminar"
      size="sm"
      bg="red.400"
      color="white"
      _hover={{ bg: 'red.500' }}
      ref={ref}
      {...props}
    />
  ),
);

const Cursos = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [inscritos, setInscritos] = useState<CursoInscrito[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = (user?.role || '').toString().toLowerCase() === 'admin';

  const {
    isOpen: isEditOpen,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: cursosData }, { data: relaciones }] = await Promise.all([
          API.get('/curso'),
          API.get('/cursos-trabajadores'),
        ]);

        const propios: CursoInscrito[] = relaciones
          .filter((r: any) => r.trabajador?.id === user?.trabajadorId)

          .map((r: any) => ({ ...r.curso, relacionId: r.id }) as CursoInscrito);

        const inscritosIds = new Set(propios.map((c) => String(c.id)));
        const disponibles = (cursosData as Curso[]).filter(
          (c) => !inscritosIds.has(String(c.id))
        );

        setCursos(disponibles);
        setInscritos(propios);
      } catch (err: any) {
        toast({
          title: 'Error al cargar datos',
          description: err.response?.data?.message || err.message,
          status: 'error',
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast, user?.email]);

  const handleInscribir = async () => {
    if (selectedIds.size === 0) {
      toast({ title: 'Selecciona cursos', status: 'info', duration: 2500 });
      return;
    }

    try {
      const fecha = new Date().toISOString().split('T')[0];
      const trabajadorId = user?.trabajadorId;

      const nuevasInscripciones: CursoInscrito[] = [];
      for (const cursoId of selectedIds) {
        const { data } = await API.post('/cursos-trabajadores/inscribir', {
          cursoId,
          trabajadorId,
          fechaRealizacion: fecha,
        });

        const cursoCreado: Curso = data.curso;
        nuevasInscripciones.push({ ...cursoCreado, relacionId: data.id });
      }

      setCursos((prev) => prev.filter((c) => !selectedIds.has(c.id!)));
      setInscritos((prev) => [...prev, ...nuevasInscripciones]);
      setSelectedIds(new Set());

      toast({ title: 'Inscripción exitosa', status: 'success', duration: 2500 });
    } catch (err: any) {
      toast({
        title: 'Error al inscribirte',
        description: err.response?.data?.message || err.message,
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handleRetirarse = async (relacionId: number, curso: CursoInscrito) => {
    try {
      await API.delete(`/cursos-trabajadores/${relacionId}`);
      setInscritos((prev) => prev.filter((c) => c.relacionId !== relacionId));
      setCursos((prev) => [...prev, curso]);
    } catch (err: any) {
      toast({
        title: 'Error al retirarse del curso',
        description: err.response?.data?.message || err.message,
        status: 'error',
        duration: 4000,
      });
    }
  };

  if (loading)
    return (
      <Center minH="200px" bg="#5b5772">
        <Spinner size="lg" color="white" />
      </Center>
    );

  return (
    <>
      <Box p={6} bg="#5b5772" borderRadius="lg" boxShadow="lg" color="white" minH="100vh">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Heading mb={0}>Lista de Cursos</Heading>

          {!isAdmin && (
            <Box position="relative">
              <IconButton
                icon={<FaGraduationCap />}
                aria-label="Cursos inscritos"
                onClick={openModal}
                bg="purple.500"
                _hover={{ bg: 'purple.600' }}
                color="white"
                borderRadius="full"
              />
              {inscritos.length > 0 && (
                <Badge
                  position="absolute"
                  top="-6px"
                  right="-6px"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  fontSize="xs"
                  px={2}
                >
                  {inscritos.length}
                </Badge>
              )}
            </Box>
          )}

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
                  <Center py={4}>No hay cursos disponibles</Center>
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
                          e.target.checked
                            ? set.add(curso.id!)
                            : set.delete(curso.id!);
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
                                  title: 'Curso eliminado',
                                  status: 'success',
                                  duration: 2000,
                                });
                              } catch (err: any) {
                                toast({
                                  title: 'Error al eliminar',
                                  description: err.response?.data?.message || err.message,
                                  status: 'error',
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

      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cursos Inscritos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Nombre</Th>
                  <Th>Descripción</Th>
                  <Th>Duración</Th>
                  {!isAdmin && <Th></Th>}
                </Tr>
              </Thead>
              <Tbody>
                {inscritos.length === 0 ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center">
                      No tienes cursos inscritos
                    </Td>
                  </Tr>
                ) : (
                  inscritos.map((curso) => (
                    <Tr key={curso.id}>
                      <Td>{curso.nombre}</Td>
                      <Td>{curso.descripcion}</Td>
                      <Td>{curso.duracion}</Td>
                      {!isAdmin && (
                        <Td textAlign="right">
                          <IconButton
                            icon={<CloseIcon />}
                            aria-label="Retirarse"
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleRetirarse(curso.relacionId, curso)}
                          />
                        </Td>
                      )}
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>

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

      {isAdmin && (
        <EditarCursos
          isOpen={isEditOpen}
          onClose={closeEdit}
          curso={editingCurso}
          onUpdate={(updated) =>
            setCursos((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            )
          }
          onDelete={(id) =>
            setCursos((prev) => prev.filter((c) => c.id !== id))
          }
        />
      )}
    </>
  );
};

export default Cursos;
