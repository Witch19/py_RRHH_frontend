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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import API from "../api/authService";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

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
              src="../../public/Logo.png"
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
        <Box
          bg="white"
          maxW="3xl"
          mx="auto"
          p={6}
          borderRadius="xl"
          boxShadow="md"
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
