import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const images = [
  { src: "/carousel/slide1.jpg", caption: "Bienvenido a nuestro sistema" },
  { src: "/carousel/slide2.jpg", caption: "Gestiona fácil tu equipo" },
  { src: "/carousel/slide3.jpg", caption: "Eficiencia y control" },
];

const LandingCarousel = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Cambia cada 3 segundos
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.800", "gray.900")}
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
      p={4}
    >
      <Center flexDir="column">
        <Image
          src={images[index].src}
          alt={images[index].caption}
          borderRadius="lg"
          boxShadow="xl"
          objectFit="cover"
          maxH="60vh"
          w="full"
          mb={4}
        />
        <Heading size="lg" textAlign="center" mb={2}>
          {images[index].caption}
        </Heading>

        <Stack mt={6} spacing={4}>
          <Button
            colorScheme="purple"
            size="lg"
            borderRadius="full"
            onClick={() => navigate("/")}
          >
            Entrar al Login
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default LandingCarousel;
