// src/components/ModalAgregarAspirante.tsx
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
  Input, Textarea, Select, useToast, useDisclosure
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import API from "../api/authService"; // asegúrate de que tenga baseURL correcta

const ModalAgregarAspirante = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [tipoTrabajo, setTipoTrabajo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [tipos, setTipos] = useState<string[]>([]);

  useEffect(() => {
    // obtener enum de tipo de trabajo
    API.get("/tipo-trabajo/enum").then((res) => {
      setTipos(res.data);
    });
  }, []);

  const handleSubmit = async () => {
    if (!nombre || !email || !tipoTrabajo || !cv) {
      toast({ title: "Campos obligatorios faltantes", status: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("tipoTrabajo", tipoTrabajo);
    formData.append("mensaje", mensaje);
    formData.append("cv", cv);

    try {
      await API.post("/aspirante", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "Postulación enviada con éxito", status: "success" });
      setNombre(""); setEmail(""); setTipoTrabajo(""); setMensaje(""); setCv(null);
      onClose();
    } catch (error) {
      toast({ title: "Error al enviar", description: "Intenta nuevamente", status: "error" });
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
              <Select placeholder="Selecciona un tipo" value={tipoTrabajo} onChange={(e) => setTipoTrabajo(e.target.value)}>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Mensaje (opcional)</FormLabel>
              <Textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            </FormControl>
            <FormControl isRequired mb={3}>
              <FormLabel>Subir CV (PDF)</FormLabel>
              <Input type="file" accept="application/pdf" onChange={(e) => setCv(e.target.files?.[0] || null)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>Enviar</Button>
            <Button onClick={onClose} ml={3}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalAgregarAspirante;
