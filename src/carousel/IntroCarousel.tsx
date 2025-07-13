import { Box, Button, Center } from "@chakra-ui/react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const images = [
  "/img1.jpg",
  "/img2.jpg",
  "/img3.jpg",
];

const IntroCarousel = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
  };

  return (
    <Box w="100vw" h="100vh" position="relative" bg="black">
      <Slider {...settings}>
        {images.map((img, idx) => (
          <Box key={idx} w="100%" h="100vh">
            <img
              src={img}
              alt={`slide-${idx}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        ))}
      </Slider>

      <Center position="absolute" bottom="40px" w="100%">
        <Button colorScheme="teal" size="lg" onClick={() => navigate("/login")}>
          Entrar
        </Button>
      </Center>
    </Box>
  );
};

export default IntroCarousel;
