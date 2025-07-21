import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  useToast,
  IconButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import API from "../api/authService";
import ModalUsuario from "../components/ModalUsuario";

interface Usuario {
  _id: string;
  username: string;
  email: string;
  role: string;
  telefono?: string;
  tipoTrabajo?: {
    nombre: string;
  };
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchUsuarios = async () => {
    try {
      const res = await API.get("/auth");
      setUsuarios(res.data);
    } catch (error: any) {
      toast({
        title: "Error al obtener usuarios",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await API.delete(`/auth/${id}`);
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
      toast({
        title: "Usuario eliminado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioActual(usuario);
    onOpen();
  };

  const handleNuevo = () => {
    setUsuarioActual(null);
    onOpen();
  };

  const actualizarLista = () => {
    fetchUsuarios();
    onClose();
  };

  if (loading) return <Spinner color="white" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color="white">
          Usuarios del sistema
        </Text>
        <Button leftIcon={<AddIcon />} colorScheme="green" onClick={handleNuevo}>
          Añadir Usuario
        </Button>
      </Box>

      <Box
        bg="white"
        rounded="md"
        p={4}
        maxH="500px"
        overflowY="auto"
        boxShadow="md"
      >
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th color="gray.800">Nombre</Th>
              <Th color="gray.800">Email</Th>
              <Th color="gray.800">Teléfono</Th>
              <Th color="gray.800">Área</Th>
              <Th color="gray.800">Rol</Th>
              <Th color="gray.800">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usuarios.map((u) => (
              <Tr key={u._id}>
                <Td color="gray.800">{u.username}</Td>
                <Td color="gray.800">{u.email}</Td>
                <Td color="gray.800">{u.telefono || "—"}</Td>
                <Td color="gray.800">{u.tipoTrabajo?.nombre || "—"}</Td>
                <Td color="gray.800">{u.role}</Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    mr={2}
                    colorScheme="gray"
                    aria-label="Editar"
                    onClick={() => handleEditar(u)}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    aria-label="Eliminar"
                    onClick={() => handleEliminar(u._id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal para editar o añadir */}
      <ModalUsuario
        isOpen={isOpen}
        onClose={onClose}
        usuario={usuarioActual}
        onSave={actualizarLista}
      />
    </Box>
  );
};

export default Usuarios;
