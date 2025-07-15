// src/components/BtnEliminar.tsx
import React from "react";
import { IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const BtnEliminar = React.forwardRef((props: any, ref: React.Ref<HTMLButtonElement>) => (
  <IconButton
    icon={<DeleteIcon />}
    aria-label="Eliminar"
    size="sm"
    bg="red.500"
    color="white"
    _hover={{ bg: "red.600" }}
    borderRadius="md"
    ref={ref}
    {...props}
  />
));

export default BtnEliminar;
