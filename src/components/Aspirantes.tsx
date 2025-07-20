import {
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
  Select,
  Textarea,
  Button,
  useToast,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import API from "../api/authService";
import { useAuth } from "../auth/AuthContext";
import { DeleteIcon } from "@chakra-ui/icons";

interface TipoTrabajo {
  id: number;
  nombre: string;
}

interface Aspirante {
  _id: string;
  nombre: string;
  email: string;
  mensaje?: string;
  cvUrl?: string;
  tipoTrabajo?: {
    nombre: string;
  };
}

const ModalAgregarAspirante = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [tipoTrabajoId, setTipoTrabajoId] = useState("");
  const [tipoTrabajos, setTipoTrabajos] = useState<TipoTrabajo[]>([]);
  const [aspirantes, setAspirantes] = useState<Aspirante[]>([]);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef(null);
  const [aspiranteAEliminar, setAspiranteAEliminar] = useState<string | null>(null);

  useEffect(() => {
    API.get("/tipo-trabajo").then((res) => setTipoTrabajos(res.data));
  }, []);

  useEffect(() => {
    if (isAdmin) {
      API.get("/aspirante").then((res) => setAspirantes(res.data));
    }
  }, [isAdmin]);

  const handleSubmit = async () => {
    if (!nombre || !email || !tipoTrabajoId || !cv) {
      toast({
        title: "Todos los campos obligatorios deben estar completos.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("mensaje", mensaje);
    formData.append("tipoTrabajoId", tipoTrabajoId);
    formData.append("file", cv);

    try {
      await API.post("/aspirante", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Postulación enviada correctamente.",
        status: "success",
        isClosable: true,
      });
      setNombre("");
      setEmail("");
      setMensaje("");
      setCv(null);
      setTipoTrabajoId("");
      onClose();

      if (isAdmin) {
        const res = await API.get("/aspirante");
        setAspirantes(res.data);
      }
    } catch (error: any) {
      toast({
        title: "Error al enviar",
        description: error.response?.data?.message || "Intenta nuevamente.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const confirmarEliminar = (id: string) => {
    setAspiranteAEliminar(id);
    setIsAlertOpen(true);
  };

  const eliminarAspirante = async () => {
    if (!aspiranteAEliminar) return;
    try {
      await API.delete(`/aspirante/${aspiranteAEliminar}`);
      setAspirantes((prev) =>
        prev.filter((a) => a._id !== aspiranteAEliminar)
      );
      toast({
        title: "Aspirante eliminado",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error al eliminar aspirante",
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsAlertOpen(false);
      setAspiranteAEliminar(null);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Postularme
      </Button>

      {isAdmin && aspirantes.length > 0 && (
        <>
          <Divider my={6} />
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Email</Th>
                <Th>Área</Th>
                <Th>Mensaje</Th>
                <Th>CV</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {aspirantes.map((a) => (
                <Tr key={a._id}>
                  <Td>{a.nombre}</Td>
                  <Td>{a.email}</Td>
                  <Td>{a.tipoTrabajo?.nombre || "N/A"}</Td>
                  <Td>{a.mensaje || "Sin mensaje"}</Td>
                  <Td>
                    {a.cvUrl ? (
                      <a
                        href={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/uploads/cv/${a.cvUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver CV
                      </a>
                    ) : (
                      "Sin archivo"
                    )}
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Eliminar"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmarEliminar(a._id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Postulación de Aspirante</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Tipo de Trabajo</FormLabel>
              <Select
                placeholder="Seleccione un área"
                value={tipoTrabajoId}
                onChange={(e) => setTipoTrabajoId(e.target.value)}
              >
                {tipoTrabajos.map((tt) => (
                  <option key={tt.id} value={tt.id}>
                    {tt.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Mensaje (opcional)</FormLabel>
              <Textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Subir CV (PDF)</FormLabel>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setCv(file);
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Enviar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Aspirante
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar este aspirante? Esta acción
              no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={eliminarAspirante} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ModalAgregarAspirante;
