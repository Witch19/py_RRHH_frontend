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
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import API from "../api/authService";
import type { Curso } from "./AgregarCursos";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  curso: Curso | null;
  onUpdate: (updated: Curso) => void;
  onDelete: (id: number) => void;
}

const EditarCurso = ({ isOpen, onClose, curso, onUpdate, onDelete }: Props) => {
  const toast = useToast();
  const [form, setForm] = useState<Curso>({
    nombre: "",
    descripcion: "",
    duracion: "",
    areas: [],
  });

  useEffect(() => {
    if (curso) setForm({ ...curso });
  }, [curso]);

  const handleGuardar = async () => {
    try {
      const res = await API.put(`/curso/${curso?.id}`, form);
      onUpdate(res.data);
      toast({ title: "Curso actualizado", status: "success", duration: 2000 });
      onClose();
    } catch (err: any) {
      toast({
        title: "Error al actualizar",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
      });
    }
  };

  const handleEliminar = async () => {
    if (!curso?.id) return;
    try {
      await API.delete(`/curso/${curso.id}`);
      onDelete(curso.id);
      toast({ title: "Curso eliminado", status: "success", duration: 2000 });
      onClose();
    } catch (err: any) {
      toast({
        title: "Error al eliminar curso",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Curso</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Input
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Duración</FormLabel>
              <Input
                value={form.duracion}
                onChange={(e) => setForm({ ...form, duracion: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Áreas (coma‑separadas)</FormLabel>
              <Input
                value={form.areas.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    areas: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr="auto" onClick={handleEliminar}>
            Eliminar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="green" onClick={handleGuardar}>
            Actualizar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditarCurso;
