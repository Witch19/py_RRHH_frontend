// src/pages/Home.tsx
import {
  Box,
  Button,
  Heading,
  Input,
  Textarea,
  FormControl,
  FormLabel,
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
      <Flex bgGradient="linear(to-r, teal.700, blue.700)" p={4} alignItems="center" color="white">
        <Image src="/logo192.png" alt="Logo" boxSize="40px" mr={4} />
        <Heading size="md">Mi Empresa</Heading>
        <Spacer />
        <HStack spacing={4}>
          <Link to="/login">
            <Button variant="ghost" colorScheme="whiteAlpha">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button colorScheme="whiteAlpha" variant="outline">
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
      <Box p={10} bg="gray.100">
        <Heading size="lg" textAlign="center" mb={6}>
          ¿En qué podemos ayudarte?
        </Heading>
        <SimpleGrid columns={[1, 2]} spacing={8} maxW="5xl" mx="auto">
          <Box
            bgGradient="linear(to-br, teal.400, teal.600)"
            color="white"
            borderRadius="xl"
            p={8}
            boxShadow="lg"
            textAlign="center"
            cursor="pointer"
            _hover={{ transform: "scale(1.03)", boxShadow: "2xl" }}
            onClick={onOpen}
          >
            <Heading size="md" mb={2}>📄 Postularme</Heading>
            <Text>Envía tu hoja de vida para oportunidades laborales.</Text>
          </Box>

          <Box
            bgGradient="linear(to-br, orange.400, orange.600)"
            color="white"
            borderRadius="xl"
            p={8}
            boxShadow="lg"
            textAlign="center"
            cursor="pointer"
            _hover={{ transform: "scale(1.03)", boxShadow: "2xl" }}
            onClick={onOpenMaquinaria}
          >
            <Heading size="md" mb={2}>🛠️ Solicitar Maquinaria</Heading>
            <Text>Solicita cotización para maquinaria o equipos industriales.</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* INFORMACIÓN DE LA EMPRESA */}
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

      {/* MODALES (Postulación y Maquinaria) se mantienen igual */}

    </Box>
  );
};

export default Home;
