import {
  Box, Button, FormControl, FormLabel, Input, Heading, Text, Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3005/auth/register', form);
      console.log(res.data);
      navigate('/');
    } catch (err) {
      alert('Error al registrarse');
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={20} p={6} borderWidth={1} borderRadius="md">
      <Heading size="lg" mb={4}>Registro de Usuario</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={3}>
          <FormLabel>Nombre de usuario</FormLabel>
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Contraseña</FormLabel>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button colorScheme="green" type="submit" width="100%">Registrar</Button>
      </form>
      <Text mt={4}>
        ¿Ya tienes cuenta?{' '}
        <Link color="blue.500" href="/">Inicia sesión</Link>
      </Text>
    </Box>
  );
};

export default Register;
