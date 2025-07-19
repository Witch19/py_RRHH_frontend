// src/pages/Home.tsx
import {
  Box, Button, Heading, Text, Flex, Spacer, Image, HStack,
  IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, FormControl, FormLabel, Input, Select,
  Textarea, useDisclosure, useToast, useColorMode,
  SimpleGrid
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import API from "../api/authService";
import { useState, useEffect } from "react";

const Home = () => {
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen: openPost, onOpen: onOpenPost, onClose: onClosePost } = useDisclosure();
  const { isOpen: openMaqui, onOpen: onOpenMaqui, onClose: onCloseMaqui } = useDisclosure();

  const [opciones, setOpciones] = useState<{ key: string; value: string }[]>([]);
  const [form, setForm] = useState({ nombre: "", email: "", tipo: "", mensaje: "", cv: null as File | null });
  const [empresa, setEmpresa] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    API.get("/tipo-trabajo/enum").then(res => setOpciones(res.data)).catch(() => toast({ title: "Error áreas", status: "error" }));
  }, []);

  const handlePost = async () => {
    if (!form.nombre || !form.email || !form.tipo) return toast({ title: "Campos faltantes", status: "warning" });

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v as any));
    try {
      await API.post("/aspirante", fd);
      toast({ title: "Enviado", status: "success" });
      setForm({ nombre: "", email: "", tipo: "", mensaje: "", cv: null });
      onClosePost();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || err.message, status: "error" });
    }
  };

  return (
    <Box bg="#0B0F1A" color="white" minH="100vh">
      {/* NAVBAR */}
      <Flex as="nav" px={8} py={4} align="center" position="absolute" top={0} w="100%" zIndex={20} bg="rgba(11,15,26,0.7)">
        <HStack spacing={4}><Image boxSize="40px" src="/Logo.png"/><Heading size="md">Mi Empresa</Heading></HStack>
        <Spacer />
        <HStack spacing={3}>
          <IconButton icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode} variant="ghost" color="white" aria-label={""}/>
          <Link to="/login"><Button variant="outline" colorScheme="teal" size="sm">Login</Button></Link>
          <Link to="/register"><Button colorScheme="teal" size="sm">Registro</Button></Link>
        </HStack>
      </Flex>

      {/* HERO */}
      <Box h="100vh" bgImage="url('/hero-bg.jpg')" bgSize="cover" bgPos="center" position="relative" display="flex" alignItems="center" justifyContent="center">
        <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" />
        <Box textAlign="center" zIndex={1} px={6}>
          <Heading fontSize={["3xl","5xl"]} mb={4} letterSpacing="wide">Soluciones en Ingeniería & Tecnología</Heading>
          <Text fontSize={["md","xl"]} mb={6}>Impulsamos el futuro con talento humano y automatización inteligente.</Text>
          <Button size="lg" bgGradient="linear(to-r, teal.400, cyan.400)" _hover={{ bgGradient: "teal.500-cyan.500" }} onClick={onOpenPost}>
            Trabaja con Nosotros
          </Button>
        </Box>
      </Box>

      {/* TRABAJA */}
      <Box bg="#11162A" py={20} px={8}>
        <Heading textAlign="center" mb={10}>¿Te gustaría unirte a nuestro equipo?</Heading>
        <SimpleGrid columns={[1,2]} spacing={8} maxW="5xl" mx="auto">
          {[
            { title: "📄 Postularme", desc:"Envía tu hoja de vida", action:onOpenPost },
            { title: "🛠 Solicitar Maquinaria", desc:"Cotiza equipos", action:onOpenMaqui }
          ].map((opt,i)=>(
            <Box key={i} bg="whiteAlpha.100" p={8} borderRadius="xl" cursor="pointer" _hover={{ bg:"whiteAlpha.200", transform:"scale(1.02)" }} onClick={opt.action}>
              <Heading size="md" mb={3}>{opt.title}</Heading>
              <Text>{opt.desc}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* SOBRE */}
      <Box bg="teal.700" py={16} textAlign="center">
        <Heading mb={4}>Sobre Nosotros</Heading>
        <Text maxW="4xl" mx="auto" fontSize="lg">
          Somos una empresa dedicada a soluciones innovadoras en ingeniería, tecnología y talento humano.
        </Text>
      </Box>

      {/* MODALES */}
      <Modal isOpen={openPost} onClose={onClosePost}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Formulario de Postulación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired><FormLabel>Nombre</FormLabel><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></FormControl>
            <FormControl isRequired mt={4}><FormLabel>Email</FormLabel><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Área de interés</FormLabel>
              <Select placeholder="Selecciona un área" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                {opciones.map((opt) => <option key={opt.key} value={opt.key}>{opt.value}</option>)}
              </Select>
            </FormControl>
            <FormControl mt={4}><FormLabel>Mensaje</FormLabel><Textarea value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} /></FormControl>
            <FormControl mt={4}><FormLabel>Subir CV (PDF)</FormLabel><Input type="file" accept="application/pdf" onChange={(e) => setForm({ ...form, cv: e.target.files?.[0] || null })} /></FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClosePost} mr={3}>Cancelar</Button>
            <Button colorScheme="teal" onClick={handlePost}>Enviar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={openMaqui} onClose={onCloseMaqui}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Solicitud de Maquinaria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired><FormLabel>Empresa</FormLabel><Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} /></FormControl>
            <FormControl isRequired mt={4}><FormLabel>Descripción</FormLabel><Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseMaqui} mr={3}>Cancelar</Button>
            <Button colorScheme="orange" onClick={() => {
              toast({ title: "Solicitud enviada", status: "info" });
              setEmpresa(""); setDescripcion(""); onCloseMaqui();
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
