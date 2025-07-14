import { Box, Button, Center } from "@chakra-ui/react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img1 from "../assets/imagen1.png";
import img2 from "../assets/imagen2.png";
import img3 from "../assets/imagen3.png";
import img4 from "../assets/imagen4.png";
import img5 from "../assets/imagen5.png";

const images = [img1, img2, img3, img4, img5];

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
    <Box w="100vw" h="100vh" position="relative" bg="black" overflow="hidden">
      <Slider {...settings}>
        {images.map((src, idx) => (
          <Box key={idx} w="100%" h="100vh">
            <img
              src={src}
              alt={`slide-${idx}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
