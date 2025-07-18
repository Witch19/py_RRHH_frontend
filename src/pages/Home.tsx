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
  /*Flex,
  Spacer,
  Image,*/
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  SimpleGrid,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import API from "../api/authService";
//import { Link } from "react-router-dom";

const Home = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenMaquinaria,
    onOpen: onOpenMaquinaria,
    onClose: onCloseMaquinaria,
  } = useDisclosure();

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
    <Box>
      {/* HERO CON IMAGEN */}
      <Box
        h="90vh"
        bgImage="url('/img1.jpg')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        textAlign="center"
      >
        <VStack spacing={4} bg="rgba(0, 0, 0, 0.5)" p={8} borderRadius="xl">
          <Heading size="2xl">Bienvenido a Mi Empresa</Heading>
          <Text fontSize="lg" maxW="lg">
            Innovación, tecnología y talento humano al servicio de tu desarrollo.
          </Text>
          <HStack>
            <Button colorScheme="teal" onClick={onOpen}>
              📄 Postularme
            </Button>
            <Button colorScheme="orange" onClick={onOpenMaquinaria}>
              🛠️ Solicitar Maquinaria
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* TARJETAS CON ICONOS */}
      <Box p={8} bg="gray.100">
        <Heading size="lg" textAlign="center" mb={6}>
          Acciones Rápidas
        </Heading>
        <SimpleGrid columns={[1, 2]} spacing={6} maxW="4xl" mx="auto">
          <Center>
            <Box
              p={6}
              bg="white"
              shadow="md"
              borderRadius="xl"
              w="250px"
              textAlign="center"
              transition="all 0.3s"
              _hover={{ transform: "scale(1.05)", bg: "gray.50" }}
              onClick={onOpen}
              cursor="pointer"
            >
              <Box bg="teal.500" borderRadius="full" w="50px" h="50px" mx="auto" mb={3} display="flex" alignItems="center" justifyContent="center">
                📄
              </Box>
              <Heading size="sm" mb={1}>Postularme</Heading>
              <Text fontSize="sm">Envía tu hoja de vida</Text>
            </Box>
          </Center>

          <Center>
            <Box
              p={6}
              bg="white"
              shadow="md"
              borderRadius="xl"
              w="250px"
              textAlign="center"
              transition="all 0.3s"
              _hover={{ transform: "scale(1.05)", bg: "gray.50" }}
              onClick={onOpenMaquinaria}
              cursor="pointer"
            >
              <Box bg="orange.500" borderRadius="full" w="50px" h="50px" mx="auto" mb={3} display="flex" alignItems="center" justifyContent="center">
                🛠️
              </Box>
              <Heading size="sm" mb={1}>Solicitar Maquinaria</Heading>
              <Text fontSize="sm">Solicita cotización industrial</Text>
            </Box>
          </Center>
        </SimpleGrid>
      </Box>

      {/* SOBRE NOSOTROS */}
      <Box bg="teal.700" color="white" py={16} px={8}>
        <Box maxW="4xl" mx="auto" textAlign="center">
          <Heading fontWeight="semibold" letterSpacing="wider" mb={4}>
            Sobre Nosotros
          </Heading>
          <Text fontSize="lg">
            Somos una empresa dedicada a brindar soluciones innovadoras en ingeniería,
            tecnología y talento humano. Buscamos personas apasionadas, comprometidas y
            con visión para el futuro.
          </Text>
        </Box>
      </Box>

      {/* MODALES */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Formulario de Postulación</ModalHeader>
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
            <FormControl mt={4}>
              <FormLabel>Mensaje</FormLabel>
              <Textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Subir CV (PDF)</FormLabel>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setCv(e.target.files?.[0] || null)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancelar</Button>
            <Button colorScheme="teal" onClick={handleSubmit}>Enviar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenMaquinaria} onClose={onCloseMaquinaria}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Solicitud de Maquinaria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Empresa</FormLabel>
              <Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseMaquinaria} mr={3}>Cancelar</Button>
            <Button
              colorScheme="orange"
              onClick={() => {
                toast({ title: "Solicitud enviada", status: "info" });
                setEmpresa("");
                setDescripcion("");
                onCloseMaquinaria();
              }}
            >
              Enviar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;