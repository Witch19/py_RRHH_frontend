import {
  Button,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import type { ReactElement } from "react";
import API from "../api/authService";
import { AddIcon } from "@chakra-ui/icons";

export interface Curso {
  id?: number;
  nombre: string;
  descripcion: string;
  duracion: string;
  areas: string[];
}

interface Props {
  onAdd: (nuevo: Curso) => void; // callback al crear
  triggerButton?: ReactElement; // botón externo opcional
}

const AgregarCurso = ({ onAdd, triggerButton }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [form, setForm] = useState<Curso>({
    nombre: "",
    descripcion: "",
    duracion: "",
    areas: [],
  });

  const handleGuardar = async () => {
    try {
      const res = await API.post("/curso", form);
      onAdd(res.data); // notifica al padre
      toast({ title: "Curso creado", status: "success", duration: 2000 });
      setForm({ nombre: "", descripcion: "", duracion: "", areas: [] });
      onClose();
    } catch (err: any) {
      toast({
        title: "Error al crear curso",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
      });
    }
  };

  return (
    <>
      {/* Botón personalizado o predeterminado */}
      {triggerButton ? (
        <span onClick={onOpen} style={{ cursor: "pointer" }}>{triggerButton}</span>
      ) : (
        <Button leftIcon={<AddIcon />} colorScheme="green" onClick={onOpen}>
                Agregar
              </Button>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo Curso</ModalHeader>
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
                  placeholder="Ej. 40 h"
                  value={form.duracion}
                  onChange={(e) => setForm({ ...form, duracion: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Áreas (coma‑separadas)</FormLabel>
                <Input
                  placeholder="RRHH, IT"
                  value={form.areas.join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      areas: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={handleGuardar}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AgregarCurso;
