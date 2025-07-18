// src/pages/Home.tsx
import {
  Box,
  Button,
  Heading,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import API from "../api/authService";

const Home = () => {
  const toast = useToast();

  // Modales
  const {
    isOpen: isAspiranteOpen,
    onOpen: onAspiranteOpen,
    onClose: onAspiranteClose,
  } = useDisclosure();

  const {
    isOpen: isMaquinariaOpen,
    onOpen: onMaquinariaOpen,
    onClose: onMaquinariaClose,
  } = useDisclosure();

  // Form Aspirante
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [tipoTrabajo, setTipoTrabajo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [opciones, setOpciones] = useState<{ key: string; value: string }[]>([]);

  // Form Maquinaria
  const [empresa, setEmpresa] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    API.get("/tipo-trabajo/enum")
      .then((res) => setOpciones(res.data))
      .catch(() =>
        toast({ title: "Error al cargar áreas", status: "error" })
      );
  }, [toast]);

  const handleAspiranteSubmit = async () => {
    if (!nombre || !email || !tipoTrabajo) {
      toast({ title: "Faltan campos", status: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("tipoTrabajo", tipoTrabajo);
    if (mensaje) formData.append("mensaje", mensaje);
    if (cv) formData.append("file", cv);

    try {
      await API.post("/aspirante", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({ title: "Solicitud enviada", status: "success" });
      onAspiranteClose();
      setNombre(""); setEmail(""); setTipoTrabajo(""); setMensaje(""); setCv(null);
    } catch (err: any) {
      toast({
        title: "Error al enviar",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    }
  };

  const handleMaquinariaSubmit = () => {
    toast({ title: "Formulario enviado", status: "info" });
    onMaquinariaClose();
    setEmpresa("");
    setDescripcion("");
  };

  return (
    <Box p={10}>
      <Heading textAlign="center" mb={8}>
        Bienvenido
      </Heading>

      <SimpleGrid columns={[1, 2]} spacing={10}>
        {/* Card Aspirante */}
        <Box
          bg="teal.500"
          p={6}
          rounded="md"
          color="white"
          _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
          onClick={onAspiranteOpen}
          cursor="pointer"
        >
          <Heading size="md" mb={2}>Trabaja con Nosotros</Heading>
          <Text>Envía tu hoja de vida y postúlate a nuestros cargos.</Text>
        </Box>

        {/* Card Maquinaria */}
        <Box
          bg="orange.500"
          p={6}
          rounded="md"
          color="white"
          _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
          onClick={onMaquinariaOpen}
          cursor="pointer"
        >
          <Heading size="md" mb={2}>Compra de Maquinaria</Heading>
          <Text>Solicita cotización para maquinaria o equipamiento industrial.</Text>
        </Box>
      </SimpleGrid>

      {/* Modal Trabaja con Nosotros */}
      <Modal isOpen={isAspiranteOpen} onClose={onAspiranteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Trabaja con Nosotros</ModalHeader>
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
              <FormLabel>Área de interés</FormLabel>
              <Select
                placeholder="Seleccione un área"
                value={tipoTrabajo}
                onChange={(e) => setTipoTrabajo(e.target.value)}
              >
                {opciones.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.value}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Mensaje</FormLabel>
              <Textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>CV (PDF)</FormLabel>
              <Input type="file" accept="application/pdf" onChange={(e) => setCv(e.target.files?.[0] || null)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onAspiranteClose} mr={3}>Cancelar</Button>
            <Button colorScheme="teal" onClick={handleAspiranteSubmit}>Enviar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Compra de Maquinaria */}
      <Modal isOpen={isMaquinariaOpen} onClose={onMaquinariaClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Compra de Maquinaria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Nombre de la Empresa</FormLabel>
              <Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Descripción del equipo</FormLabel>
              <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onMaquinariaClose} mr={3}>Cancelar</Button>
            <Button colorScheme="orange" onClick={handleMaquinariaSubmit}>Enviar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;
