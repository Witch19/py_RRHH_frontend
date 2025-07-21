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
  Tooltip,
  HStack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useAuth } from "../auth/AuthContext";
import AgregarTrabajador from "../components/AgregarTrabajador";
import EditarTrabajador from "../components/EditarTrabajador";
import type { TrabajadorModal } from "../components/EditarTrabajador";

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState<TrabajadorModal[]>([]);
  const [loading, setLoading] = useState(true);
  const [trabajadorActual, setTrabajadorActual] = useState<TrabajadorModal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const openEditar = (trabajador: TrabajadorModal) => {
    setTrabajadorActual(trabajador);
    setIsEditing(true);
  };

  const closeEditar = () => {
    setTrabajadorActual(null);
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/trabajadores");
        const conCamposCompletos: TrabajadorModal[] = data.map((t: any) => ({
          id: Number(t.id),
          nombre: t.nombre,
          email: t.email ?? "-",
          tipoTrabajo: t.tipoTrabajo ?? null,
          telefono: t.telefono || "-",
          direccion: t.direccion || "-",
          cvUrl: t.cvUrl || "",
        }));
        setTrabajadores(conCamposCompletos);
      } catch (err: any) {
        toast({
          title: "Error al cargar trabajadores",
          description: err.response?.data?.message || err.message,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleEliminar = async (id?: number) => {
    if (!id) return;
    try {
      await API.delete(`/trabajadores/${id}`);
      setTrabajadores((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Trabajador eliminado", status: "success" });
    } catch (err: any) {
      toast({
        title: "Error al eliminar",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    }
  };

  const handleActualizar = (actualizado: TrabajadorModal) => {
    setTrabajadores((prev) =>
      prev.map((t) => (t.id === actualizado.id ? actualizado : t))
    );
    toast({ title: "Trabajador actualizado", status: "success" });
  };

  if (!isAdmin) {
    return (
      <Center minH="100vh" bg="#5b5772">
        <Heading fontSize="2xl" color="white">
          Acceso restringido
        </Heading>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center minH="300px" bg="#5b5772">
        <Spinner size="lg" color="white" />
      </Center>
    );
  }

  return (
    <Box p={6} bg="#5b5772" minH="100vh" color="white">
      <HStack mb={4} justify="space-between">
        <Heading>Lista de Trabajadores</Heading>
        <AgregarTrabajador
          onAdd={(nuevo: any) => {
            const nuevoConCampos: TrabajadorModal = {
              id: Number(nuevo.id),
              nombre: nuevo.nombre,
              email: nuevo.email,
              tipoTrabajo: nuevo.tipoTrabajo,
              telefono: nuevo.telefono || "-",
              direccion: nuevo.direccion || "-",
              cvUrl: nuevo.cvUrl || "",
            };
            setTrabajadores((prev) => [...prev, nuevoConCampos]);
          }}
        />
      </HStack>

      <Box
        overflowY="auto"
        maxHeight="70vh"
        borderRadius="lg"
        border="1px solid #ccc"
        bg="white"
        color="gray.800"
      >
        <Table variant="simple" minWidth="800px">
          <Thead position="sticky" top={0} zIndex="docked" bg="gray.100">
            <Tr>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Área</Th>
              <Th>Teléfono</Th>
              <Th>Dirección</Th>
              <Th>Hoja de Vida</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {trabajadores.length === 0 ? (
              <Tr>
                <Td colSpan={7}>
                  <Center py={4}>No hay trabajadores registrados</Center>
                </Td>
              </Tr>
            ) : (
              trabajadores.map((t) => (
                <Tr key={t.id}>
                  <Td>{t.nombre}</Td>
                  <Td>{t.email}</Td>
                  <Td>{t.tipoTrabajo?.nombre || "-"}</Td>
                  <Td>{t.telefono}</Td>
                  <Td>{t.direccion}</Td>
                  <Td>
                    {t.cvUrl ? (
                      <a
                        href={`/trabajador/cv/${t.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver CV
                      </a>
                    ) : (
                      "No adjunto"
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Editar">
                        <IconButton
                          aria-label="Editar"
                          icon={<EditIcon />}
                          size="sm"
                          onClick={() => openEditar(t)}
                        />
                      </Tooltip>
                      <Tooltip label="Eliminar">
                        <IconButton
                          aria-label="Eliminar"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleEliminar(t.id)}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {trabajadorActual && (
        <EditarTrabajador
          isOpen={isEditing}
          onClose={closeEditar}
          trabajador={trabajadorActual}
          onUpdate={handleActualizar}
        />
      )}
    </Box>
  );
};

export default Trabajadores;
