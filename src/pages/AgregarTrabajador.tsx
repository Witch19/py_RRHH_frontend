import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, useDisclosure, FormControl,
  FormLabel, Input, useToast, Select
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import API from "../api/authService";

interface Props {
  onAdd: (trabajador: any) => void;
}

interface TipoTrabajo {
  id: number;
  nombre: string;
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
  const [tipoTrabajoId, setTipoTrabajoId] = useState("");
  const [tipoTrabajoOpciones, setTipoTrabajoOpciones] = useState<TipoTrabajo[]>([]);

  // Cargar áreas de trabajo desde el backend
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const { data } = await API.get("/tipo-trabajo");
        setTipoTrabajoOpciones(data);
      } catch (err) {
        toast({ title: "Error cargando áreas", status: "error" });
      }
    };
    fetchTipos();
  }, []);

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setTelefono("");
    setDireccion("");
    setTipoTrabajoId("");
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
    formData.append("tipoTrabajoId", tipoTrabajoId);

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
              <FormLabel>Área de trabajo</FormLabel>
              <Select
                placeholder="Seleccione un área"
                value={tipoTrabajoId}
                onChange={(e) => setTipoTrabajoId(e.target.value)}
              >
                {tipoTrabajoOpciones.map((tt) => (
                  <option key={tt.id} value={tt.id}>
                    {tt.nombre}
                  </option>
                ))}
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
