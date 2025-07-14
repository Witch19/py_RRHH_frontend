import { Box, Center, Heading, Image } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";          // ← import correcto
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

// Animación de palpitación
const pulse = keyframes`
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Center
      w="100vw"
      h="100vh"
      bgGradient="linear(to-br, teal.700, blue.900)"
      flexDirection="column"
      color="white"
    >
      <Heading mb={8} fontSize="4xl" textAlign="center">
        Bienvenido
      </Heading>

      <Box
        as="button"
        onClick={() => navigate("/login")}
        animation={`${pulse} 2s infinite`}
        _hover={{ transform: "scale(1.15)", transition: "0.3s" }}
        outline="none"
      >
        <Image src={logo} alt="Logo" maxW="200px" objectFit="contain" />
      </Box>
    </Center>
  );
};

export default Landing;
