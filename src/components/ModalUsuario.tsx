import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import API from "../api/authService";

interface Usuario {
  _id?: string;
  username: string;
  email: string;
  role: string;
  telefono?: string;
  tipoTrabajoId?: number;
}

interface TipoTrabajo {
  id: number;
  nombre: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  onSave: () => void;
}

const ModalUsuario = ({ isOpen, onClose, usuario, onSave }: Props) => {
  const [form, setForm] = useState<Usuario>({
    username: "",
    email: "",
    role: "TRABAJADOR",
    telefono: "",
    tipoTrabajoId: undefined,
  });
  const [tipoTrabajos, setTipoTrabajos] = useState<TipoTrabajo[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const isEdit = !!usuario;

  useEffect(() => {
    const fetchTipoTrabajos = async () => {
      try {
        const res = await API.get("/tipo-trabajo");
        setTipoTrabajos(res.data);
      } catch (err) {
        toast({
          title: "Error cargando áreas",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchTipoTrabajos();
  }, []);

  useEffect(() => {
    if (usuario) {
      setForm({
        username: usuario.username,
        email: usuario.email,
        role: usuario.role,
        telefono: usuario.telefono || "",
        tipoTrabajoId: usuario.tipoTrabajoId ?? undefined,
      });
    } else {
      setForm({
        username: "",
        email: "",
        role: "TRABAJADOR",
        telefono: "",
        tipoTrabajoId: undefined,
      });
    }
  }, [usuario]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "tipoTrabajoId" ? parseInt(value) : value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEdit && usuario?._id) {
        await API.put(`/auth/${usuario._id}`, form);
        toast({ title: "Usuario actualizado", status: "success", duration: 3000 });
      } else {
        const password = prompt("Asignar contraseña al nuevo usuario:");
        if (!password) throw new Error("Contraseña requerida");

        await API.post("/auth/register", { ...form, password });
        toast({ title: "Usuario creado", status: "success", duration: 3000 });
      }
      onSave();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? "Editar Usuario" : "Agregar Usuario"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Nombre</FormLabel>
            <Input name="username" value={form.username} onChange={handleChange} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Teléfono</FormLabel>
            <Input name="telefono" value={form.telefono} onChange={handleChange} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Área de trabajo</FormLabel>
            <Select
              name="tipoTrabajoId"
              value={form.tipoTrabajoId ?? ""}
              onChange={handleChange}
              placeholder="Selecciona área"
            >
              {tipoTrabajos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Rol</FormLabel>
            <Select name="role" value={form.role} onChange={handleChange}>
              <option value="ADMIN">ADMIN</option>
              <option value="TRABAJADOR">TRABAJADOR</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button colorScheme="purple" onClick={handleSubmit} isLoading={loading}>
            {isEdit ? "Guardar Cambios" : "Agregar Usuario"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalUsuario;
