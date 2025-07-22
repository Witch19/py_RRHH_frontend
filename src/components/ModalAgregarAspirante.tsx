import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
  Input, Textarea, Select, useToast, useDisclosure
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
  const [tipoTrabajoId, setTipoTrabajoId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [tipos, setTipos] = useState<TipoTrabajo[]>([]);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await API.get("/tipo-trabajo");
        setTipos(res.data);
      } catch (err) {
        toast({
          title: "Error al cargar tipos de trabajo",
          status: "error",
          isClosable: true,
        });
      }
    };

    fetchTipos();
  }, []);

  const resetForm = () => {
    setNombre("");
    setEmail("");
    setTipoTrabajoId("");
    setMensaje("");
    setCv(null);
  };

  const handleSubmit = async () => {
    if (!nombre || !email || !tipoTrabajoId || !cv) {
      toast({ title: "Por favor completa todos los campos obligatorios", status: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("tipoTrabajoId", tipoTrabajoId);
    formData.append("mensaje", mensaje);
    formData.append("cv", cv);

    try {
      await API.post("/aspirante", formData); // ❌ NO pongas headers

      toast({ title: "Postulación enviada con éxito", status: "success" });
      resetForm();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error al enviar",
        description: error.response?.data?.message || "Intenta nuevamente",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button variant="link" color="white" onClick={onOpen}>
        Trabaja con nosotros
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Postulación de Aspirante</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={3}>
              <FormLabel>Nombre</FormLabel>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </FormControl>
            <FormControl isRequired mb={3}>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired mb={3}>
              <FormLabel>Tipo de Trabajo</FormLabel>
              <Select
                placeholder="Selecciona un tipo"
                value={tipoTrabajoId}
                onChange={(e) => setTipoTrabajoId(e.target.value)}
              >
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Mensaje (opcional)</FormLabel>
              <Textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            </FormControl>
            <FormControl isRequired mb={3}>
              <FormLabel>Subir CV (PDF)</FormLabel>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setCv(e.target.files?.[0] || null)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Enviar
            </Button>
            <Button onClick={onClose} ml={3}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalAgregarAspirante;
