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
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import API from "../api/authService";
import { useAuth } from "../auth/AuthContext";

export interface TrabajadorModal {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  cvUrl?: string;
  tipoTrabajo?: {
    id: number;
    nombre: string;
  };
}

interface TipoTrabajo {
  id: number;
  nombre: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trabajador: TrabajadorModal;
  onUpdate: (t: TrabajadorModal) => void;
}

const EditarTrabajador = ({ isOpen, onClose, trabajador, onUpdate }: Props) => {
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [tipoTrabajoId, setTipoTrabajoId] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [tipoTrabajoOpciones, setTipoTrabajoOpciones] = useState<TipoTrabajo[]>([]);

  // Cargar opciones de área
  useEffect(() => {
    API.get("/tipo-trabajo/enum")
      .then((res) => {
        setTipoTrabajoOpciones(res.data);
      })
      .catch((err) =>
        toast({
          title: "Error al cargar áreas",
          description: err.response?.data?.message || err.message,
          status: "error",
        })
      );
  }, []);

  // Cargar datos del trabajador seleccionado
  useEffect(() => {
    if (trabajador) {
      setNombre(trabajador.nombre || "");
      setEmail(trabajador.email || "");
      setTelefono(trabajador.telefono || "");
      setDireccion(trabajador.direccion || "");
      setTipoTrabajoId(trabajador.tipoTrabajo?.id?.toString() || "");
    }
  }, [trabajador]);

  const handleSubmit = async () => {
    try {
      let response;

      if (isAdmin && cvFile) {
        const data = new FormData();
        data.append("nombre", nombre);
        data.append("email", email);
        if (telefono) data.append("telefono", telefono);
        if (direccion) data.append("direccion", direccion);
        data.append("tipoTrabajoId", tipoTrabajoId);
        data.append("file", cvFile);

        response = await API.patch(`/trabajador/${trabajador.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const payload = {
          nombre,
          email,
          telefono,
          direccion,
          tipoTrabajoId,
        };
        response = await API.patch(`/trabajador/${trabajador.id}`, payload);
      }

      onUpdate(response.data);
      toast({ title: "Trabajador actualizado", status: "success" });
      onClose();
    } catch (err: any) {
      toast({
        title: "Error al actualizar",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Trabajador</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
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

          {isAdmin && (
            <FormControl mt={4}>
              <FormLabel>Hoja de Vida (PDF)</FormLabel>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              />
            </FormControl>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Actualizar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditarTrabajador;
