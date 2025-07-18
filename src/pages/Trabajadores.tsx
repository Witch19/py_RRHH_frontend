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
import { useThemeColor } from "../context/ThemeContext";
import AgregarTrabajador from "./AgregarTrabajador";
import EditarTrabajador from "./EditarTrabajador";
import type { TrabajadorModal } from "./EditarTrabajador";

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState<TrabajadorModal[]>([]);
  const [loading, setLoading] = useState(true);
  const [trabajadorActual, setTrabajadorActual] = useState<TrabajadorModal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const { gradient } = useThemeColor();

  // 🔒 Bloquear completamente si no es ADMIN
  if (!isAdmin) {
    return (
      <Center minH="100vh">
        <Heading fontSize="2xl" color="white">Acceso restringido</Heading>
      </Center>
    );
  }

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
        const { data } = await API.get("/trabajador");
        const conCamposCompletos: TrabajadorModal[] = data.map((t: any) => ({
          id: Number(t._id ?? t.id ?? ""),
          nombre: t.nombre,
          email: t.email ?? t.correo ?? "-",
          area: t.area || t.tipoTrabajo?.nombre || "-",
          telefono: t.telefono || "-",
          direccion: t.direccion || "-",
          cvUrl: t.cvUrl || "",
          tipoTrabajo: t.tipoTrabajo,
        }));

        setTrabajadores(conCamposCompletos);
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

  const handleEliminar = async (id?: number) => {
    if (!id) return;
    try {
      await API.delete(`/trabajador/${id}`);
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

  if (loading)
    return (
      <Center minH="200px">
        <Spinner size="lg" color="white" />
      </Center>
    );
    // <Td>{t.area || t.tipoTrabajo?.nombre || "-"}</Td> area: nuevo.area || "-",

  return (
    <Box p={6} bgGradient={gradient} borderRadius="lg" boxShadow="lg" color="white">
      <HStack mb={4} justify="space-between">
        <Heading>Lista de Trabajadores</Heading>
        {isAdmin && (
          <AgregarTrabajador
            onAdd={(nuevo: any) => {
              const nuevoConCampos: TrabajadorModal = {
                id: Number(nuevo.id),
                nombre: nuevo.nombre,
                email: nuevo.email,
                area: nuevo.area || "-",
                telefono: nuevo.telefono || "-",
                direccion: nuevo.direccion || "-",
                cvUrl: nuevo.cvUrl || "",
                tipoTrabajo: nuevo.tipoTrabajo,
              };
              setTrabajadores((prev) => [...prev, nuevoConCampos]);
            }}
          />
        )}
      </HStack>

      <Box overflowY="auto" maxHeight="700px" borderRadius="md" border="1px solid #ccc">
        <Table variant="simple" bg="white" color="gray.800" minWidth="800px">
          <Thead position="sticky" top={0} zIndex="docked" bg="gray.100">
            <Tr>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Área</Th>
              <Th>Teléfono</Th>
              <Th>Dirección</Th>
              <Th>Hoja de Vida</Th>
              {isAdmin && <Th>Acciones</Th>}
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
                  <Td>{t.area || t.tipoTrabajo?.nombre || "-"}</Td>
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
                  {isAdmin && (
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
                  )}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {isAdmin && trabajadorActual && (
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
