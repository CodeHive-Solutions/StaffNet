import React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import LogoST from "./LogoST";
import LogoutIcon from "@mui/icons-material/Logout";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Pagination } from "@mui/material";
import TextField from "@mui/material/TextField";
import Fade from '@mui/material/Fade';
import Link from "@mui/material/Link";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const pageInputs = [
    // Inputs Pagina Información Personal
    {
        title: "Información Personal",
        inputs: [
            { id: "1", label: "Cedula", name: "1" },
            { id: "2", label: "Nombre", name: "2" },
            { id: "3", label: "Fecha de nacimiento", name: "3" },
            { id: "4", label: "Genero", name: "4" },
            { id: "5", label: "Edad", name: "5" },
            { id: "7", label: "RH", name: "7" },
            { id: "8", label: "Estado Civil", name: "8" },
            { id: "9", label: "Hijos", name: "9" },
            { id: "10", label: "Estrato", name: "10" },
            { id: "11", label: "Telefono Fijo", name: "11" },
            { id: "12", label: "Celular", name: "12" },
            { id: "13", label: "Correo", name: "13" },
            { id: "14", label: "Direccion", name: "14" },
            { id: "15", label: "Barrio", name: "15" },
            { id: "16", label: "Contacto de emergencia", name: "16" },
            { id: "17", label: "Parentesco", name: "17" },
            { id: "18", label: "Telefono de contacto", name: "18" },
        ],
    },
    // Inputs Pagina Información Educativa
    {
        title: "Información Educativa",
        inputs: [
            { id: "19", label: "Nivel de escolaridad", name: "19" },
            { id: "20", label: "Profesion", name: "20" },
            { id: "21", label: "Estudios en curso", name: "21" },
        ],
    },
    // Inputs Pagina Información Empleado
    {
        title: "Información Empleado",
        inputs: [
            { id: "22", label: "Fecha de Afiliacion", name: "22" },
            { id: "23", label: "EPS", name: "23" },
            { id: "24", label: "Pension", name: "24" },
            { id: "25", label: "Cesantias", name: "25" },
            {
                id: "27",
                label: "Cambio de eps y fecha de pension",
                name: "27",
            },
            { id: "28", label: "Cuenta nomina", name: "28" },
            { id: "29", label: "Fecha de ingreso", name: "29" },
            { id: "30", label: "Cargo", name: "30" },
            { id: "31", label: "Gerencia", name: "31" },
            { id: "32", label: "Campaña general", name: "32" },
            { id: "33", label: "Area de negocio", name: "33" },
            { id: "34", label: "Tipo de contrato", name: "34" },
            { id: "36", label: "Salario 2023", name: "36" },
            { id: "37", label: "Subsidio de transporte 2023", name: "37" },
            {
                id: "38",
                label: "Fecha de cambio de campaña y periodo de prueba",
                name: "38",
            },
        ],
    },
    // Inputs Pagina Evaluacion de Desempeño
    {
        title: "Evaluacion de Desempeño",
        inputs: [
            { id: "40", label: "Llamado de atencion", name: "40" },
            {
                id: "41",
                label: "Desempeño Primer Semestre 2016",
                name: "41",
            },
            {
                id: "42",
                label: "Desempeño Segundo Semestre 2016",
                name: "42",
            },
            { id: "44", label: "Desempeño 2017", name: "44" },
            { id: "45", label: "Desempeño 2018", name: "45" },
            { id: "46", label: "Desempeño 2019", name: "46" },
            { id: "47", label: "Desempeño 2020", name: "47" },
            { id: "48", label: "Desempeño 2021", name: "48" },
        ],
    },
    // Inputs Pagina Acciones Diciplinarias
    {
        title: "Acciones Diciplinarias",
        inputs: [
            { id: "49", label: "Llamado de atencion", name: "49" },
            { id: "50", label: "Memorando 1", name: "50" },
            { id: "51", label: "Memorando 2", name: "51" },
            { id: "52", label: "Memorando 3", name: "52" },
        ],
    },

    // Inputs Pagina Información vacaciones
    {
        title: "Información de Vacaciones",
        inputs: [
            { id: "53", label: "Licencia no remunerada", name: "53" },
            {
                id: "54",
                label: "Periodos tomados de vacaciones",
                name: "54",
            },
            {
                id: "55",
                label: "Periodos faltantes de vacaciones",
                name: "55",
            },
            { id: "56", label: "Fecha de salida de vacaciones", name: "56" },
            {
                id: "57",
                label: "Fecha de ingreso de vacaciones",
                name: "57",
            },
        ],
    },

    // Inputs Pagina Información Retiro
    {
        title: "Información de Retiro",
        inputs: [
            { id: "58", label: "Fecha de retiro", name: "58" },
            { id: "59", label: "Tipo de retiro", name: "59" },
            { id: "60", label: "Motivo del retiro", name: "60" },
            { id: "61", label: "Estado", name: "61" },
        ],
    },
];

const totalPages = pageInputs.length;

const SingUpView = ({ handleViewChange }) => {
    const [formData, setFormData] = useState({});
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [openSnackSession, setOpenSnackSession] = React.useState(false);

    useEffect(() => {
        setOpen(!open)
    }, []);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleClickSnackSession = () => {
        setOpenSnackSession(true);
    };

    const handleCloseSession = () => {
        setOpenSnackSession(false);
    };


    const handleSubmit = (event) => {
        // Send a POST request to the server
        const dataP = {
            password: `${document.getElementById("clave").value}`,
            user: `${document.getElementById("usuario").value}`,
        };
        fetch("http://localhost:5000/App", {
            method: "POST",
            body: JSON.stringify(dataP),
        })
            .then((response) => {
                // Check if the response was successful
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                console.log(
                    "conn:",
                    data.login,
                    "error",
                    data.error,
                    typeof data.login
                );
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <Fade in={open}>
            <Container>
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={openSnackSession}
                    onClose={handleCloseSession}
                    key={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        severity="warning"
                        onClose={handleCloseSession}
                        sx={{ width: "100%" }}
                    >
                        ¿Esta seguro que desea cerrar sesion?
                        <Box sx={{ display: "flex", justifyContent: "center", mt: "5px" }}>
                            <Button color="inherit" onClick={() => handleViewChange("LoginView")}>
                                Confirmar
                            </Button>
                        </Box>
                    </Alert>
                </Snackbar>
                <Box
                    sx={{
                        my: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            userSelect: "none",
                        }}
                    >
                        <Link
                            color="inherit"
                            underline="none"
                            onClick={() => handleViewChange("HomeView")}
                            sx={{ cursor: "pointer" }}
                        >
                            <LogoST></LogoST>
                        </Link>
                    </Box>
                    <Box>
                        <Button
                            size="Large"
                            color="error"
                            onClick={() => handleClickSnackSession()}
                        >
                            <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                                <LogoutIcon></LogoutIcon>
                            </Box>
                            Cerrar Sesion
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant="h3" gutterBottom>
                        Registrar <b>usuario</b>
                    </Typography>
                </Box>
                <Box
                    component={Paper}
                    elevation={0}
                    sx={{
                        p: "30px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="h4">
                            {pageInputs[page - 1].title}
                        </Typography>
                    </Box>
                    <Box
                        component={"form"}
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: "wrap",
                            height: "25rem",
                            gap: "10px",
                            p: "40px",
                        }}
                    >
                        {pageInputs[page - 1].inputs.map((field) => (
                            <TextField
                                key={field.id}
                                id={field.id}
                                label={field.label}
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleFormChange}
                            />
                        ))}
                    </Box>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                    />
                </Box>
            </Container>
        </Fade>
    );
};

export default SingUpView;
