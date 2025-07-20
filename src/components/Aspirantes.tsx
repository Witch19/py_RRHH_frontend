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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import API from "../api/authService";

interface TipoTrabajo {
  id: number;
  nombre: string;
}

const ModalAgregarAspirante = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [tipoTrabajoId, setTipoTrabajoId] = useState("");
  const [tipoTrabajos, setTipoTrabajos] = useState<TipoTrabajo[]>([]);

  useEffect(() => {
    API.get("/tipo-trabajo").then((res) => setTipoTrabajos(res.data));
  }, []);

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
      // Reset
      setNombre("");
      setEmail("");
      setMensaje("");
      setCv(null);
      setTipoTrabajoId("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Error al enviar",
        description: error.response?.data?.message || "Intenta nuevamente.",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">Postularme</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Postulación de Aspirante</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
              <Textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
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
    </>
  );
};

export default ModalAgregarAspirante;
