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
        <HStack spacing={4}>
          <Image src="/Logo.png" alt="Logo" boxSize="40px" />
          <Heading size="md" color="white">Neuratech</Heading>
        </HStack>
        <HStack spacing={4}>
          <Button as={RouterLink} to="/" variant="ghost" color="white">Home</Button>
          <Button as={RouterLink} to="/about" variant="ghost" color="white">About</Button>
          <Button as={RouterLink} to="/login" variant="ghost" color="white">Login</Button>
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
      <Box
        h="90vh"
        bgImage="url('/hero-people.jpg')"
        bgSize="cover"
        bgPosition="center"
        position="relative"
      >
        <Box position="absolute" inset={0} bg="rgba(0, 0, 50, 0.6)" />
        <Flex
          direction="column"
          position="relative"
          alignItems="center"
          justifyContent="center"
          h="100%"
          px={6}
          textAlign="center"
        >
          <MotionBox
            border="2px solid #00FFB3"
            px={6}
            py={4}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <MotionHeading size="2xl" color="white" mb={4}>
              Work Life Balance – Reality or Myth?
            </MotionHeading>
            <Box borderBottom="2px solid #00FFB3" w="80px" mx="auto" mb={4} />
            <Button colorScheme="blue" as={RouterLink} to="/register">Postúlate</Button>
          </MotionBox>
        </Flex>
      </Box>

      {/* ABOUT THE EVENT */}
      <Flex bg="white" py={20} px={8} align="center">
        <Box flex="1" pr={8}>
          <Text textTransform="uppercase" color="blue.500" letterSpacing="wide" mb={2}>
            About the event
          </Text>
          <Heading size="xl" mb={4}>Work Life Balance – Reality or Myth?</Heading>
          <Text color="gray.600">
            I'm a paragraph. Click here to add your own text and edit me…
          </Text>
        </Box>
        <Box>
          <MotionImage
            src="/icon-event.png"
            alt="event icon"
            boxSize="300px"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </Box>
      </Flex>

      {/* INTERMEDIATE IMAGE */}
      <Image src="/crowd.jpg" alt="Crowd at event" w="100%" />

      {/* ABOUT NET-WORK */}
      <Flex bg="#1A253A" color="white" py={20} px={8} align="center">
        <Box flex="1" pr={8}>
          <Text textTransform="uppercase" color="teal.300" letterSpacing="wide" mb={2}>
            Net‑Work
          </Text>
          <Heading size="xl" mb={4}>About Net‑Work</Heading>
          <Text color="gray.300" mb={4}>
            I'm a paragraph… Tell a story and let your users know a little more about you.
          </Text>
          <Text color="gray.300">
            This is a great space to write long text about your company and your services…
          </Text>
        </Box>
        <Box>
          <Image src="/icon-about.png" alt="about icon" boxSize="300px" />
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
      <Box bg="teal.400" py={16} px={8} textAlign="center">
        <Heading mb={6} color="white">Nuestras Soluciones</Heading>

        <Text mb={10} color="white" maxW="3xl" mx="auto">
          Contamos con diversos productos, servicios, insumos, software y convenios de mantención, seleccionados e importados bajo los más altos estándares de calidad.
        </Text>

        <SimpleGrid columns={1} spacing={6} maxW="md" mx="auto">
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
            >
              <Image src={o.src} alt={o.name} borderRadius="md" w="100%" h="auto" />
              <Text mt={4} fontWeight="bold" fontSize="lg">{o.name}</Text>
              <Text color="gray.500" fontSize="sm">{o.role}</Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Box>



      {/* SPONSORS */}
      <Box py={16} px={8} textAlign="center">
        <Heading mb={8}>Empresas asociadas</Heading>
        <HStack spacing={12} justify="center">
          {["sponsor1.png", "sponsor2.png", "sponsor3.png", "sponsor4.png", "sponsor5.png"].map((src, i) => (
            <MotionImage
              key={i}
              src={`/${src}`}
              alt=""
              boxSize="80px"
              objectFit="contain"
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </HStack>
      </Box>

      {/* RSVP CTA */}
      <Box
        bgImage="url('/rsvp-bg.jpg')"
        bgSize="cover"
        bgPos="center"
        position="relative"
        py={32}
      >
        <Box position="absolute" inset={0} bg="rgba(0, 0, 50, 0.6)" />
        <Box position="relative" textAlign="center" zIndex={1} px={6}>
          <MotionHeading
            size="lg"
            mb={4}
            color="white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            We can’t wait to see you at our next event.
          </MotionHeading>
          <Button colorScheme="blue" as={RouterLink} to="/register">RSVP</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
