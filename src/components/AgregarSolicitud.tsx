// src/components/AgregarSolicitud.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
//import { useAuth } from "../auth/AuthContext";
import API from "../api/authService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AgregarSolicitud = ({ isOpen, onClose, onAdd }: Props) => {
  const toast = useToast();
  //const { user } = useAuth();

  const [form, setForm] = useState({
    tipo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/solicitudes", form);
      toast({
        title: "Solicitud enviada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onAdd();
      onClose();
      setForm({ tipo: "", descripcion: "", fechaInicio: "", fechaFin: "" });
    } catch (err) {
      toast({
        title: "Error al enviar solicitud",
        description: "Verifica los datos",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nueva Solicitud</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired mb={3}>
            <FormLabel>Tipo</FormLabel>
            <Select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="Vacaciones">Vacaciones</option>
              <option value="Permiso">Permiso</option>
              <option value="Enfermedad">Enfermedad</option>
            </Select>
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Descripción</FormLabel>
            <Textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired mb={3}>
            <FormLabel>Fecha Inicio</FormLabel>
            <Input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Fecha Fin</FormLabel>
            <Input type="date" name="fechaFin" value={form.fechaFin} onChange={handleChange} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Enviar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AgregarSolicitud;
