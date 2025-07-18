// src/pages/Home.tsx
import {
  Box,
  Button,
  Heading,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  Select,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import API from "../api/authService";

const Home = () => {
  const toast = useToast();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [tipoTrabajo, setTipoTrabajo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [opciones, setOpciones] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    const fetchEnum = async () => {
      try {
        const { data } = await API.get("/tipo-trabajo/enum");
        setOpciones(data);
      } catch (error) {
        toast({
          title: "Error al cargar áreas",
          status: "error",
        });
      }
    };
    fetchEnum();
  }, [toast]);

  const handleSubmit = async () => {
    if (!nombre || !email || !tipoTrabajo) {
      toast({
        title: "Faltan campos requeridos",
        status: "warning",
      });
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

      toast({
        title: "Solicitud enviada correctamente",
        status: "success",
      });

      // Reset
      setNombre("");
      setEmail("");
      setTipoTrabajo("");
      setMensaje("");
      setCv(null);
    } catch (err: any) {
      toast({
        title: "Error al enviar solicitud",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, blue.700, teal.600)"
      color="white"
      px={8}
      py={16}
    >
      <Heading textAlign="center" mb={8}>
        ¡Trabaja con Nosotros!
      </Heading>

      <Box
        bg="white"
        color="black"
        maxW="lg"
        mx="auto"
        borderRadius="xl"
        p={8}
        boxShadow="lg"
      >
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Área de interés</FormLabel>
            <Select
              placeholder="Selecciona un área"
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

          <FormControl>
            <FormLabel>Mensaje</FormLabel>
            <Textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Cuéntanos por qué deseas unirte"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Subir CV (PDF)</FormLabel>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setCv(e.target.files?.[0] || null)}
            />
          </FormControl>

          <Button colorScheme="teal" w="full" mt={4} onClick={handleSubmit}>
            Enviar Solicitud
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Home;
