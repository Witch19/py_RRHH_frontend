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
  Flex,
  Spacer,
  Image,
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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import API from "../api/authService";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

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
      {/* NAVBAR */}
      <Flex bg="teal.700" p={4} alignItems="center" color="white">
        <Image src="/logo192.png" alt="Logo" boxSize="40px" mr={4} />
        <Heading size="md">Mi Empresa</Heading>
        <Spacer />
        <HStack spacing={4}>
          <Link to="/login">
            <Button colorScheme="teal" variant="outline">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button colorScheme="teal" variant="solid">
              Registro
            </Button>
          </Link>
        </HStack>
      </Flex>

      {/* CARRUSEL */}
      <Box maxW="100%" h="400px" overflow="hidden">
        <Swiper autoplay={{ delay: 3000 }} loop>
          <SwiperSlide>
            <Image
              src="/img1.jpg"
              w="100%"
              h="400px"
              objectFit="cover"
              alt="Empresa 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/img2.jpg"
              w="100%"
              h="400px"
              objectFit="cover"
              alt="Empresa 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/img3.jpg"
              w="100%"
              h="400px"
              objectFit="cover"
              alt="Empresa 3"
            />
          </SwiperSlide>
        </Swiper>
      </Box>

      {/* TRABAJA CON NOSOTROS */}
      <Box p={8} bg="gray.100">
        <Heading size="lg" textAlign="center" mb={6}>
          Trabaja con Nosotros
        </Heading>

        <SimpleGrid columns={[1, 2]} spacing={6} maxW="4xl" mx="auto">
          <Box
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="md"
            textAlign="center"
            cursor="pointer"
            _hover={{ transform: "scale(1.03)", boxShadow: "xl" }}
            onClick={onOpen}
          >
            <Heading size="md" mb={2}>📄 Postularme</Heading>
            <Text>Envía tu hoja de vida para oportunidades laborales.</Text>
          </Box>

          <Box
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="md"
            textAlign="center"
            cursor="pointer"
            _hover={{ transform: "scale(1.03)", boxShadow: "xl" }}
            onClick={onOpenMaquinaria}
          >
            <Heading size="md" mb={2}>🛠️ Solicitar Maquinaria</Heading>
            <Text>Solicita cotización para maquinaria o equipos.</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* MODAL ASPIRANTE */}
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

      {/* MODAL MAQUINARIA */}
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

      {/* INFORMACIÓN DE LA EMPRESA */}
      <Box bg="teal.700" color="white" py={12} px={8}>
        <Box maxW="4xl" mx="auto" textAlign="center">
          <Heading size="md" mb={4}>
            Sobre Nosotros
          </Heading>
          <Text fontSize="lg">
            Somos una empresa dedicada a brindar soluciones innovadoras en ingeniería,
            tecnología y talento humano. Buscamos personas apasionadas, comprometidas y
            con visión para el futuro.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
