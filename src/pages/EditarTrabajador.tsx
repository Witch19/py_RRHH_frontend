import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import API from "../api/authService";
import { useAuth } from "../auth/AuthContext";
//import type { TrabajadorModal } from "./EditarTrabajador";


/* ---------- Tipo que usamos en la vista principal ---------- */
// src/components/EditarTrabajador.tsx
export interface TrabajadorModal {
    id: number;
    nombre: string;
    email: string;
    area?: string;
    telefono?: string;
    direccion?: string;
    cvUrl?: string;
    tipoTrabajo?: any;
}



interface Props {
    isOpen: boolean;
    onClose: () => void;
    trabajador: TrabajadorModal;
    onUpdate: (t: TrabajadorModal) => void;
}

const EditarTrabajador = ({ isOpen, onClose, trabajador, onUpdate }: Props) => {
    const toast = useToast();
    const { user } = useAuth();
    const isAdmin = user?.role?.toUpperCase() === "ADMIN";

    /* ---------- State ---------- */
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        tipoTrabajoId: "",
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [tiposTrabajo, setTiposTrabajo] = useState<
        { id: number; nombre: string }[]
    >([]);

    /* ---------- Carga inicial ---------- */
    useEffect(() => {
        API.get("/tipo-trabajo").then((res) => setTiposTrabajo(res.data));
    }, []);

    /* ---------- Actualiza estado al abrir ---------- */
    useEffect(() => {
        if (trabajador) {
            setForm({
                nombre: trabajador.nombre,
                apellido: "", // puedes rellenarlo si lo tienes
                email: trabajador.email,
                telefono: trabajador.telefono || "",
                direccion: trabajador.direccion || "",
                tipoTrabajoId: trabajador.tipoTrabajo?.id?.toString() || "",
            });
        }
    }, [trabajador]);

    /* useEffect(() => {
         const fetchData = async () => {
             try {
                 const { data } = await API.get("/trabajador");
                 const conCamposCompletos: TrabajadorModal[] = data.map((t: any) => ({
                     id: Number(t._id ?? t.id ?? ""),
                     nombre: t.nombre,
                     email: t.email ?? t.correo ?? "-",
                     area: t.area || t.tipoTrabajo?.nombre || "-",
                     telefono: t.telefono || "-",
                     direccion: t.direccion || "-",
                     cvUrl: t.cvUrl || "",
                     tipoTrabajo: t.tipoTrabajo,
                 }));
 
                 setTrabajadores(conCamposCompletos);
             } catch (err: any) {
                 toast({
                     title: "Error al cargar trabajadores",
                     description: err.response?.data?.message || err.message,
                     status: "error",
                     duration: 4000,
                     isClosable: true,
                 });
             } finally {
                 setLoading(false);
             }
         };
         fetchData();
     }, [toast]);*/


    /* ---------- Handlers ---------- */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            let response;

            /* Si ADMIN y sube nuevo CV => multipart */
            if (isAdmin && cvFile) {
                const data = new FormData();
                Object.entries(form).forEach(([k, v]) => data.append(k, v));
                data.append("file", cvFile);
                response = await API.patch(`/trabajador/${trabajador.id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                /* Patch simple JSON */
                response = await API.patch(`/trabajador/${trabajador.id}`, {
                    ...form,
                });
            }

            onUpdate(response.data);
            toast({ title: "Trabajador actualizado", status: "success" });
            onClose();
        } catch (err: any) {
            toast({
                title: "Error al actualizar",
                description: err.response?.data?.message || err.message,
                status: "error",
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Trabajador</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Nombre</FormLabel>
                        <Input name="nombre" value={form.nombre} onChange={handleChange} />
                    </FormControl>

                    <FormControl isRequired mt={3}>
                        <FormLabel>Apellido</FormLabel>
                        <Input name="apellido" value={form.apellido} onChange={handleChange} />
                    </FormControl>

                    <FormControl isRequired mt={3}>
                        <FormLabel>Email</FormLabel>
                        <Input name="email" value={form.email} onChange={handleChange} />
                    </FormControl>

                    <FormControl mt={3}>
                        <FormLabel>Teléfono</FormLabel>
                        <Input name="telefono" value={form.telefono} onChange={handleChange} />
                    </FormControl>

                    <FormControl mt={3}>
                        <FormLabel>Dirección</FormLabel>
                        <Input name="direccion" value={form.direccion} onChange={handleChange} />
                    </FormControl>

                    <FormControl isRequired mt={3}>
                        <FormLabel>Área</FormLabel>
                        <Select
                            name="tipoTrabajoId"
                            value={form.tipoTrabajoId}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un área</option>
                            {tiposTrabajo.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.nombre}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    {isAdmin && (
                        <FormControl mt={3}>
                            <FormLabel>Hoja de Vida (PDF)</FormLabel>
                            <Input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                            />
                        </FormControl>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button colorScheme="blue" ml={3} onClick={handleSave}>
                        Actualizar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditarTrabajador;

