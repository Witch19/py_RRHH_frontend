import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, useDisclosure, FormControl,
  FormLabel, Input, useToast, Select
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import API from "../api/authService";

interface Props {
  onAdd: (trabajador: any) => void;
}

const AgregarTrabajador = ({ onAdd }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [tipoTrabajador, setTipoTrabajador] = useState("");

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setTelefono("");
    setDireccion("");
    setTipoTrabajador("");
    setCv(null);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("email", email);
    if (telefono) formData.append("telefono", telefono);
    if (direccion) formData.append("direccion", direccion);
    if (cv) formData.append("file", cv);
    if (tipoTrabajador) formData.append("tipoTrabajador", tipoTrabajador);

    try {
      const { data } = await API.post("/trabajadores", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onAdd(data);
      toast({ title: "Trabajador agregado", status: "success" });
      onClose();
      resetForm();
    } catch (err: any) {
      toast({
        title: "Error al guardar",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    }
  };

  return (
    <>
      <Button leftIcon={<AddIcon />} colorScheme="green" onClick={onOpen}>
        Agregar
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Trabajador</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Apellido</FormLabel>
              <Input value={apellido} onChange={(e) => setApellido(e.target.value)} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Rol del Trabajador</FormLabel>
              <Select
                placeholder="Seleccione un rol"
                value={tipoTrabajador}
                onChange={(e) => setTipoTrabajador(e.target.value)}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="TRABAJADOR">TRABAJADOR</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Dirección</FormLabel>
              <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Hoja de Vida (PDF)</FormLabel>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setCv(e.target.files?.[0] || null)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AgregarTrabajador;
