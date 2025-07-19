// src/pages/Home.tsx
import {
  Box, Button, Heading, Input, Textarea, FormControl, FormLabel,
  useToast, Select, Flex, Image, HStack, Text,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, SimpleGrid, useDisclosure,
  IconButton, useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/authService";

const Home = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenMaquinaria, onOpen: onOpenMaquinaria, onClose: onCloseMaquinaria } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [tipoTrabajo, setTipoTrabajo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [opciones, setOpciones] = useState<{ key: string; value: string }[]>([]);
  const [empresa, setEmpresa] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const fetchEnum = async () => {
      try {
        const { data } = await API.get("/tipo-trabajo/enum");
        setOpciones(data);
      } catch (error) {
        toast({ title: "Error al cargar áreas", status: "error" });
      }
    };
    fetchEnum();
  }, [toast]);

  const handleSubmit = async () => {
    if (!nombre || !email || !tipoTrabajo) {
      toast({ title: "Faltan campos requeridos", status: "warning" });
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
      onClose();
      setNombre(""); setEmail(""); setTipoTrabajo("");
      setMensaje(""); setCv(null);
    } catch (err: any) {
      toast({
        title: "Error al enviar solicitud",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    }
  };

  return (
    <Box bg="#0d102e" color="white" minH="100vh">
      {/* NAVBAR */}
      <Flex px={6} py={4} alignItems="center" justifyContent="space-between" bg="rgba(0,0,0,0.7)" position="absolute" w="100%" zIndex={10}>
        <HStack spacing={4} align="center">
          <Image src="/Logo.png" alt="Logo" boxSize="40px" />
          <Heading size="md">Mi Empresa</Heading>
        </HStack>
        <HStack spacing={3}>
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="white"
          />
          <Link to="/login">
            <Button colorScheme="teal" variant="outline">Login</Button>
          </Link>
          <Link to="/register">
            <Button colorScheme="teal">Registro</Button>
          </Link>
        </HStack>
      </Flex>

      {/* HERO SECTION */}
      <Box
        bgImage="url('/hero-bg.jpg')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={6}
      >
        <Box bg="rgba(0, 0, 0, 0.6)" p={10} borderRadius="2xl">
          <Heading fontSize="4xl" mb={4}>Soluciones de Ingeniería & Tecnología</Heading>
          <Text fontSize="lg" mb={6}>
            Impulsamos el futuro con talento humano y automatización inteligente.
          </Text>
          <Button colorScheme="teal" size="lg" onClick={onOpen}>
            Trabaja con Nosotros
          </Button>
        </Box>
      </Box>

      {/* TRABAJA CON NOSOTROS */}
      <Box py={20} bg="#111436" px={8}>
        <Heading size="lg" textAlign="center" mb={10}>¿Quieres ser parte de nuestro equipo?</Heading>
        <SimpleGrid columns={[1, 2]} spacing={8} maxW="5xl" mx="auto">
          <Box bg="whiteAlpha.100" p={8} borderRadius="xl" _hover={{ transform: "scale(1.03)", bg: "whiteAlpha.200" }} onClick={onOpen}>
            <Heading size="md" mb={3}>📄 Postularme</Heading>
            <Text>Envía tu hoja de vida para oportunidades laborales.</Text>
          </Box>
          <Box bg="whiteAlpha.100" p={8} borderRadius="xl" _hover={{ transform: "scale(1.03)", bg: "whiteAlpha.200" }} onClick={onOpenMaquinaria}>
            <Heading size="md" mb={3}>🛠️ Solicitar Maquinaria</Heading>
            <Text>Solicita cotización para maquinaria o equipos.</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* SOBRE NOSOTROS */}
      <Box bg="teal.700" py={16} px={8} textAlign="center">
        <Heading size="md" mb={4}>Sobre Nosotros</Heading>
        <Text fontSize="lg" maxW="4xl" mx="auto">
          Somos una empresa dedicada a brindar soluciones innovadoras en ingeniería,
          tecnología y talento humano. Buscamos personas apasionadas, comprometidas y
          con visión para el futuro.
        </Text>
      </Box>

      {/* MODALES */}
      {/* Postulación */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Formulario de Postulación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired><FormLabel>Nombre</FormLabel><Input value={nombre} onChange={(e) => setNombre(e.target.value)} /></FormControl>
            <FormControl isRequired mt={4}><FormLabel>Email</FormLabel><Input value={email} onChange={(e) => setEmail(e.target.value)} /></FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Área de interés</FormLabel>
              <Select placeholder="Selecciona un área" value={tipoTrabajo} onChange={(e) => setTipoTrabajo(e.target.value)}>
                {opciones.map((opt) => <option key={opt.key} value={opt.key}>{opt.value}</option>)}
              </Select>
            </FormControl>
            <FormControl mt={4}><FormLabel>Mensaje</FormLabel><Textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} /></FormControl>
            <FormControl mt={4}>
              <FormLabel>Subir CV (PDF)</FormLabel>
              <Input type="file" accept="application/pdf" onChange={(e) => setCv(e.target.files?.[0] || null)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancelar</Button>
            <Button colorScheme="teal" onClick={handleSubmit}>Enviar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Solicitud de maquinaria */}
      <Modal isOpen={isOpenMaquinaria} onClose={onCloseMaquinaria}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Solicitud de Maquinaria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired><FormLabel>Empresa</FormLabel><Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} /></FormControl>
            <FormControl isRequired mt={4}><FormLabel>Descripción</FormLabel><Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseMaquinaria} mr={3}>Cancelar</Button>
            <Button colorScheme="orange" onClick={() => {
              toast({ title: "Solicitud enviada", status: "info" });
              setEmpresa(""); setDescripcion(""); onCloseMaquinaria();
            }}>
              Enviar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;
