import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, useDisclosure, FormControl,
  FormLabel, Input, useToast, Select
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import API from "../api/authService";

interface Props {
  onAdd: (trabajador: any) => void;
}

// Opciones del enum tipoTrabajador
const tipoTrabajadorOpciones = [
  "SEGURIDAD INDUSTRIAL",
  "MANTENIMIENTO",
  "INGENIERIA",
  "RECURSOS HUMANOS",
  "MARKETING",
  "OPERARIO",
  "TI",
  "OTROS",
];

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
  const [tipoTrabajador, setTipoTrabajador] = useState("");
  const [tipoTrabajos, setTipoTrabajos] = useState<any[]>([]);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const { data } = await API.get("/tipo-trabajo");
        setTipoTrabajos(data);
      } catch (err: any) {
        toast({
          title: "Error al cargar áreas",
          description: err.response?.data?.message || err.message,
          status: "error",
        });
      }
    };
    fetchTipos();
  }, [toast]);

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setTelefono("");
    setDireccion("");
    setTipoTrabajoId("");
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
    formData.append("tipoTrabajoId", String(Number(tipoTrabajoId))); // ← convertir a número
    formData.append("tipoTrabajador", tipoTrabajador); // ← enum como string

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
                {tipoTrabajos.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Rol del Trabajador</FormLabel>
              <Select
                placeholder="Seleccione un rol"
                value={tipoTrabajador}
                onChange={(e) => setTipoTrabajador(e.target.value)}
              >
                {tipoTrabajadorOpciones.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
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
