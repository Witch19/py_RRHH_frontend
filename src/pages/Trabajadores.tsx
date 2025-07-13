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
  Spinner,
  useToast,
  IconButton,
  Button,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  HStack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import { useAuth } from "../auth/AuthContext";
import { useThemeColor } from "../context/ThemeContext";

interface Trabajador {
  _id?: string;
  nombre: string;
  correo: string;
  area: string;
}

const Trabajadores = () => {
  /* ───────── Hooks ───────── */
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const { gradient } = useThemeColor();

  /* ───────── Modal state ───────── */
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<Trabajador | null>(null);
  const [form, setForm] = useState<Trabajador>({ nombre: "", correo: "", area: "" });
  const [saving, setSaving] = useState(false);

  /* ───────── Fetch list ───────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/trabajador");
        setTrabajadores(data);
      } catch (err: any) {
        toast({
          title: "Error al cargar trabajadores",
          description: err.response?.data?.message || err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  /* ───────── Handlers ───────── */
  const openAddModal = () => {
    setEditing(null);
    setForm({ nombre: "", correo: "", area: "" });
    onOpen();
  };

  const openEditModal = (trab: Trabajador) => {
    setEditing(trab);
    setForm({ ...trab });
    onOpen();
  };

  const handleSave = async () => {
    if (!form.nombre || !form.correo) {
      toast({ title: "Completa todos los campos", status: "warning" });
      return;
    }

    setSaving(true);
    try {
      if (editing?._id) {
        // editar
        const { data } = await API.put(`/trabajador/${editing._id}`, form);
        setTrabajadores((prev) =>
          prev.map((t) => (t._id === editing._id ? data : t))
        );
        toast({ title: "Trabajador actualizado", status: "success" });
      } else {
        // agregar
        const { data } = await API.post("/trabajador", form);
        setTrabajadores((prev) => [...prev, data]);
        toast({ title: "Trabajador creado", status: "success" });
      }
      onClose();
    } catch (err: any) {
      toast({
        title: "Error al guardar",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id?: string) => {
    if (!id) return;
    try {
      await API.delete(`/trabajador/${id}`);
      setTrabajadores((prev) => prev.filter((t) => t._id !== id));
      toast({ title: "Trabajador eliminado", status: "success" });
    } catch (err: any) {
      toast({
        title: "Error al eliminar",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    }
  };

  /* ───────── UI loading ───────── */
  if (loading)
    return (
      <Center minH="200px">
        <Spinner size="lg" color="white" />
      </Center>
    );

  /* ───────── JSX ───────── */
  return (
    <Box p={6} bgGradient={gradient} borderRadius="lg" boxShadow="lg" color="white">
      <HStack mb={4} justify="space-between">
        <Heading>Lista de Trabajadores</Heading>
        {isAdmin && (
          <Button leftIcon={<AddIcon />} colorScheme="green" onClick={openAddModal}>
            Agregar
          </Button>
        )}
      </HStack>

      <Table variant="simple" bg="white" color="gray.800" borderRadius="md">
        <Thead bg="gray.100">
          <Tr>
            <Th>Nombre</Th>
            <Th>Correo</Th>
            <Th>Área</Th>
            {isAdmin && <Th>Acciones</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {trabajadores.length === 0 ? (
            <Tr>
              <Td colSpan={isAdmin ? 4 : 3}>
                <Center py={4}>No hay trabajadores registrados</Center>
              </Td>
            </Tr>
          ) : (
            trabajadores.map((t) => (
              <Tr key={t._id}>
                <Td>{t.nombre}</Td>
                <Td>{t.correo}</Td>
                <Td>{t.area}</Td>
                {isAdmin && (
                  <Td>
                    <Tooltip label="Editar">
                      <IconButton
                        aria-label="Editar"
                        icon={<EditIcon />}
                        size="sm"
                        mr={2}
                        onClick={() => openEditModal(t)}
                      />
                    </Tooltip>
                    <Tooltip label="Eliminar">
                      <IconButton
                        aria-label="Eliminar"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleEliminar(t._id)}
                      />
                    </Tooltip>
                  </Td>
                )}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* ───────── Modal Agregar / Editar ───────── */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editing ? "Editar Trabajador" : "Agregar Trabajador"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Correo</FormLabel>
              <Input
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Área</FormLabel>
              <Input
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancelar
            </Button>
            <Button colorScheme="purple" isLoading={saving} onClick={handleSave}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Trabajadores;
