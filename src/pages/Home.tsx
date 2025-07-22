// src/pages/Home.tsx
import {
  Box, Button, Heading, Text, Flex, Image, HStack,
  IconButton, SimpleGrid, useColorMode
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import ModalAgregarAspirante from "../components/ModalAgregarAspirante";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionImage = motion(Image);

const Home = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box fontFamily="sans-serif">
      {/* NAVBAR */}
      <Flex
        as="nav"
        pt={4}
        px={8}
        position="absolute"
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        zIndex={20}
        bg="rgba(0,0,0,0.4)"
      >
        <HStack spacing={4}></HStack>
        <HStack spacing={4}>
          <Button as={RouterLink} to="/" variant="ghost" color="white">Home</Button>
          <Button as={RouterLink} to="/login" variant="ghost" color="white">Iniciar sesion</Button>
          <Button as={RouterLink} to="/register" variant="ghost" color="white">Registro</Button>
          <ModalAgregarAspirante />
          <IconButton
            aria-label="theme toggle"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            color="white"
            variant="ghost"
          />
        </HStack>
      </Flex>

      {/* HERO */}
      <Box h="90vh" position="relative" overflow="hidden">
        {/* 🎥 VIDEO DE FONDO */}
        <Box as="video"
          src="/Video_publicitario.mp4"
          autoPlay
          muted
          loop
          playsInline
          position="absolute"
          inset={0}
          w="100%"
          h="100%"
          objectFit="cover"
          zIndex={0}
        />

        {/* 🟦 CAPA OSCURA */}
        <Box position="absolute" inset={0} bg="rgba(0, 0, 50, 0.6)" zIndex={1} />

        {/* 🌟 CONTENIDO */}
        <Flex
          direction="column"
          position="relative"
          alignItems="center"
          justifyContent="center"
          h="100%"
          px={6}
          textAlign="center"
          zIndex={2}
        >
          <MotionBox
            border="2px solid #41ac8cff"
            px={6}
            py={4}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <MotionHeading size="2xl" color="white" mb={4}>
              NEURATECH
            </MotionHeading>
            <Box borderBottom="2px solid #4dbd9bff" w="80px" mx="auto" mb={4} />
          </MotionBox>
        </Flex>
      </Box>


      {/* ABOUT THE EVENT */}
      <Flex bg="white" py={20} px={8} align="center" justify="space-between" direction={["column", "row"]}>
        <Box flex="1" pr={[0, 8]} mb={[8, 0]}>
          <Text textTransform="uppercase" color="blue.500" fontWeight="bold" letterSpacing="wide" mb={2}>
            About the Event
          </Text>
          <Heading size="xl" mb={4} fontWeight="extrabold" color="#1A253A">
            Work Life Balance – Reality or Myth?
          </Heading>
          <Text color="gray.600" fontSize="md">
            ¿Es posible encontrar el equilibrio perfecto entre la vida laboral y personal? Descubre con nosotros esta reflexión en un evento inspirador que conecta con tu realidad diaria.
          </Text>
        </Box>
        <Box>
          <MotionImage
            src="/EQUILIBRIO.png"
            alt="event icon"
            boxSize={["180px", "240px", "300px"]}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </Box>
      </Flex>


      {/* ABOUT NET-WORK */}
      <Flex bg="#1A253A" color="white" py={20} px={8} align="center">
        <Box flex="1" pr={8}>
          <Text textTransform="uppercase" color="teal.300" letterSpacing="wide" mb={2}>
            Net‑Work
          </Text>
          <Heading size="xl" mb={4}>Sobre Nosotros</Heading>
          <Text color="gray.300" mb={4}>
            Somos un integrador regional de soluciones tecnológicas para empresas de diversas industrias. Apoyamos a nuestros clientes a enfrentar sus desafíos de transformación tecnológica y digital. Desarrollamos sistemas que integran hardware, software y redes, con servicios de continuidad operativa y de valor agregado, que potencian las operaciones, procesos y experiencia de usuario de nuestros clientes, a través de la innovación y mejora continua.
          </Text>
          <Text color="gray.300">
            Representamos y tenemos alianzas con empresas tecnológicas líderes a nivel mundial. En Vigatec somos un equipo multidisciplinario con más de 350 personas. Nuestro Headquarter está en Santiago de Chile y estamos presentes con filiales en Colombia, Ecuador, Perú, Bolivia y Paraguay, con cobertura comercial y técnica en cada país.
          </Text>
        </Box>
        <Box>
          <Image src="/Logo.png" alt="about icon" boxSize="300px" />
        </Box>
      </Flex>


      {/* ORGANIZERS */}
      <Box py={16} px={8} textAlign="center">
        <Heading mb={8}>Representantes</Heading>
        <SimpleGrid columns={[1, 3]} spacing={8} maxW="7xl" mx="auto">
          {[
            { name: "Maria Sassoon", src: "/org1.png", role: "RRHH" },
            { name: "Tony Selby", src: "/org2.png", role: "Certificaciones" },
            { name: "Rachel Harbourne", src: "/org3.png", role: "Investigación y Desarrollo" },
          ].map((o, i) => (
            <MotionBox
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image src={o.src} alt={o.name} borderRadius="md" />
              <Text mt={4} fontWeight="bold">{o.name}</Text>
              <Text color="gray.500">{o.role}</Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Box>


      {/* PAST EVENTS */}
      <Box bg="#2eb3b3ff" py={16} px={8} textAlign="center">
        <Heading mb={6} color="white">Nuestras Productos</Heading>

        <Text mb={10} color="white" maxW="4xl" mx="auto">
          Contamos con diversos productos, servicios, software y convenios de mantenimiento, seleccionados e importados bajo los más altos estándares de calidad.
        </Text>

        <SimpleGrid columns={[1, 2, 3]} spacing={6} maxW="7xl" mx="auto">
          {[
            {
              name: "Portal de Empleados",
              src: "/RRHH1.png",
              role: "Gestión de datos, perfiles, contratos y documentos del personal.",
            },
            {
              name: "Sistema de Reclutamiento Online",
              src: "/RRHH2.png",
              role: "Publicación de ofertas, recepción de CVs y selección de candidatos.",
            },
            {
              name: "Plataforma de Cursos y Certificados",
              src: "/CERTI1.png",
              role: "Usuarios pueden tomar cursos, rendir evaluaciones y recibir certificados.",
            },
            {
              name: "Gestor de Certificados Digitales",
              src: "/CERTI2.png",
              role: "Permite emitir, descargar y verificar certificados en PDF o con QR.",
            },
            {
              name: "Gestor de Proyectos Web",
              src: "/INVE1.png",
              role: "Seguimiento de ideas, desarrollo de soluciones y gestión de tareas técnicas.",
            },
            {
              name: "Panel de Resultados y Métricas",
              src: "/INVE2.png",
              role: "Visualización de indicadores de innovación, eficiencia y progreso.",
            },
          ].map((o, i) => (
            <MotionBox
              key={i}
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              p={4}
              boxShadow="md"
              textAlign="left"
              w="100%"
              minH="240px"
            >
              <Image
                src={o.src}
                alt={o.name}
                borderRadius="md"
                w="80px"
                h="80px"
                objectFit="contain"
                mb={4}
              />
              <Text fontWeight="bold" fontSize="md" mb={1}>{o.name}</Text>
              <Text color="gray.500" fontSize="sm">{o.role}</Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Box>




      {/* SPONSORS */}
      <Box py={16} px={8} textAlign="center">
        <Heading mb={8}>Empresas asociadas</Heading>
        <HStack spacing={16} justify="center">
          {["sponsor1.png", "sponsor2.png", "sponsor3.png", "sponsor4.png", "sponsor5.png"].map((src, i) => (
            <MotionImage
              key={i}
              src={`/${src}`}
              alt=""
              boxSize="120px" // Aumentado para que sean más grandes
              objectFit="contain"
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </HStack>
      </Box>


      {/* RSVP CTA */}
      <Box bg="#0B1C49" color="white" py={16} px={8}>
        <SimpleGrid columns={[1, 2, 3, 6]} spacing={8} maxW="7xl" mx="auto" textAlign="left">
          <Box>
            <Image src="/Logo.png" alt="Neuratech" mb={4} w="120px" />
          </Box>

          <Box>
            <Text fontWeight="bold" color="teal.300">🇨🇱 Chile</Text>
            <Text><strong>Dirección:</strong> José Ananías 441, Macul, Santiago.</Text>
            <Text mt={2}><strong>Teléfono:</strong> +56 2 12345678</Text>
          </Box>

          <Box>
            <Text fontWeight="bold" color="teal.300">🇪🇨 Ecuador</Text>
            <Text><strong>Quito:</strong> Av. Amazonas 123, Piso 2, Quito.</Text>
            <Text><strong>Guayaquil:</strong> World Trade Center, Torre A, Of. 206.</Text>
            <Text mt={2}><strong>Tel:</strong> +593 99 123 4567</Text>
          </Box>

          <Box>
            <Text fontWeight="bold" color="teal.300">🇨🇴 Colombia</Text>
            <Text><strong>Dirección:</strong> Calle 99 #12-39 Piso 4, Bogotá.</Text>
            <Text mt={2}><strong>Tel:</strong> +57 300 1234567</Text>
          </Box>

          <Box>
            <Text fontWeight="bold" color="teal.300">🇵🇪 Perú</Text>
            <Text><strong>Dirección:</strong> Monte Rosa 240, Surco, Lima.</Text>
            <Text mt={2}><strong>Tel:</strong> +51 987654321</Text>
          </Box>

          <Box>
            <Text fontWeight="bold" color="teal.300">🇵🇾 Paraguay</Text>
            <Text><strong>Dirección:</strong> Edificio Itasa, Piso 5, Asunción.</Text>
            <Text mt={2}><strong>Tel:</strong> +595 21 555555</Text>
          </Box>
        </SimpleGrid>

        <Box mt={12} borderTop="1px solid rgba(255,255,255,0.1)" pt={6} textAlign="center">
          <Text fontSize="sm">© 2025 Neuratech.</Text>
        </Box>
      </Box>


    </Box>
  );
};

export default Home;
