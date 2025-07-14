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

const EditarCurso = ({ isOpen, onClose, curso, onUpdate}: Props) => {
  const toast = useToast();

  const [form, setForm] = useState<Curso>({
    nombre: "",
    descripcion: "",
    duracion: "",
    areas: [],
  });

  const [areasInput, setAreasInput] = useState(""); // Nuevo estado para texto de áreas

  useEffect(() => {
    if (curso) {
      setForm({ ...curso });
      setAreasInput(curso.areas.join(", ")); // mostrar áreas como texto
    }
  }, [curso]);

  const handleGuardar = async () => {
    if (!curso?.id) return;
    try {
      const actualizado: Curso = {
        ...form,
        areas: areasInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await API.patch(`/curso/${curso.id}`, actualizado);
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
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Duración</FormLabel>
              <Input
                value={form.duracion}
                onChange={(e) =>
                  setForm({ ...form, duracion: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Áreas (coma‑separadas)</FormLabel>
              <Input
                type="text"
                value={areasInput}
                onChange={(e) => setAreasInput(e.target.value)}
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
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
