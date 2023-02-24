import React from "react";
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Collapse, Pagination } from "@mui/material";
import TextField from "@mui/material/TextField";
import Fade from '@mui/material/Fade';
import Header from "./Header";
import MenuItem from '@mui/material/MenuItem';

const pageInputs = [
    // Inputs Pagina Información Personal
    {
        title: "Información Personal",
        inputs: [
            { id: "1", label: "Cedula", name: "cedula", type: "number" },
            { id: "2", label: "Nombre", name: "nombre", type: "text" },
            { id: "3", label: "Fecha de nacimiento", name: "fecha_nacimiento", type: "date", shrink: true },
            { id: "4", label: "Genero", name: "genero", type: "text" },
            { id: "5", label: "Edad", name: "edad", type: "number" },
            {
                id: "7", label: "RH", name: "rh", type: "select", options: [
                    { value: 'O+', label: 'O+' },
                    { value: 'A+', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'AB-', label: 'AB-' },
                ]
            },
            { id: "8", label: "Estado Civil", name: "estado_civil", type: "text" },
            { id: "9", label: "Hijos", name: "hijos", type: "number" },
            { id: "510", label: "Personas a cargo", name: "personas_a_cargo", type: "number" },
            { id: "10", label: "Estrato", name: "estrato", type: "number" },
            { id: "11", label: "Telefono Fijo", name: "tel_fijo", type: "number" },
            { id: "12", label: "Celular", name: "celular", type: "text" },
            { id: "13", label: "Correo", name: "correo", type: "email" },
            { id: "14", label: "Direccion", name: "direccion", type: "text" },
            { id: "15", label: "Barrio", name: "barrio", type: "text" },
            { id: "16", label: "Contacto de emergencia", name: "contacto_emergencia", type: "text" },
            { id: "17", label: "Parentesco", name: "parentesco", type: "text" },
            { id: "18", label: "Telefono de contacto", name: "tel_contacto", type: "text" },
        ],
    },
    // Inputs Pagina Información Educativa
    {
        title: "Información Educativa",
        inputs: [
            { id: "19", label: "Nivel de escolaridad", name: "nivel_escolaridad", type: "text" },
            { id: "20", label: "Profesion", name: "profesion", type: "text" },
            { id: "21", label: "Estudios en curso", name: "estudios_en_curso", type: "text" },
        ],
    },
    // Inputs Pagina Información Empleado
    {
        title: "Información Empleado",
        inputs: [
            { id: "fecha_afiliacion", label: "Fecha de Afiliacion", name: "fecha_afiliacion", type: "date", shrink: true },
            { id: "eps", label: "EPS", name: "eps", type: "text" },
            { id: "pension", label: "Pension", name: "pension", type: "text" },
            { id: "cesantias", label: "Cesantias", name: "cesantias", type: "text" },
            { id: "cambio_eps_pension_fecha", label: "Cambio de eps y fecha de pension", name: "cambio_eps_pension_fecha", type: "text" },
            { id: "cuenta_nomina", label: "Cuenta nomina", name: "cuenta_nomina", type: "number" },
            { id: "fecha_ingreso", label: "Fecha de ingreso", name: "fecha_ingreso", type: "date", shrink: true },
            { id: "cargo", label: "Cargo", name: "cargo", type: "text" },
            { id: "gerencia", label: "Gerencia", name: "gerencia", type: "text" },
            { id: "campana_general", label: "Campaña general", name: "campana_general", type: "text" },
            { id: "area_negocio", label: "Area de negocio", name: "area_negocio", type: "text" },
            { id: "tipo_contrato", label: "Tipo de contrato", name: "tipo_contrato", type: "text" },
            { id: "salario_2023", label: "Salario 2023", name: "salario_2023", type: "text" },
            { id: "subsidio_transporte_2023", label: "Subsidio de transporte 2023", name: "subsidio_transporte_2023", type: "text" },
            { id: "fecha_cambio_campana_periodo_prueba", label: "Fecha de cambio de campaña y periodo de prueba", name: "fecha_cambio_campana_periodo_prueba", type: "date", shrink: true },
        ],
    },

    // Inputs Pagina Evaluacion de Desempeño
    {
        title: "Evaluacion de Desempeño",
        inputs: [
            {
                id: "41",
                label: "Desempeño Primer Semestre 2016",
                name: "desempeno_1_sem_2016",
                type: "text"
            },
            {
                id: "42",
                label: "Desempeño Segundo Semestre 2016",
                name: "desempeno_2_sem_2016",
                type: "text"
            },
            { id: "44", label: "Desempeño 2017", name: "desempeno_2017", type: "text" },
            { id: "45", label: "Desempeño 2018", name: "desempeno_2018", type: "text" },
            { id: "46", label: "Desempeño 2019", name: "desempeno_2019", type: "text" },
            { id: "47", label: "Desempeño 2020", name: "desempeno_2020", type: "text" },
            { id: "48", label: "Desempeño 2021", name: "desempeno_2021", type: "text" },
        ],
    },
    // Inputs Pagina Acciones Diciplinarias
    {
        title: "Acciones Diciplinarias",
        inputs: [
            { id: "49", label: "Llamado de atencion", name: "llamado_atencion", type: "text" },
            { id: "50", label: "Memorando 1", name: "memorando_1", type: "text" },
            { id: "51", label: "Memorando 2", name: "memorando_2", type: "text" },
            { id: "52", label: "Memorando 3", name: "memorando_3", type: "text" },
        ],
    },

    // Inputs Pagina Información vacaciones
    {
        title: "Información de Vacaciones",
        inputs: [
            { id: "53", label: "Licencia no remunerada", name: "licencia_no_remunerada", type: "text" },
            {
                id: "54",
                label: "Periodos tomados de vacaciones",
                name: "periodo_tomado_vacaciones",
                type: "text"
            },
            {
                id: "55",
                label: "Periodos faltantes de vacaciones",
                name: "periodos_faltantes_vacaciones",
                type: "text"
            },
            { id: "56", label: "Fecha de salida de vacaciones", name: "fecha_salida_vacaciones", type: "date", shrink: true },
            {
                id: "57",
                label: "Fecha de ingreso de vacaciones",
                name: "fecha_ingreso_vacaciones",
                type: "date",
                shrink: true
            },
        ],
    },

    // Inputs Pagina Información Retiro
    {
        title: "Información de Retiro",
        inputs: [
            { id: "58", label: "Fecha de retiro", name: "fecha_retiro", type: "date", shrink: true },
            { id: "59", label: "Tipo de retiro", name: "tipo_de_retiro", type: "text" },
            { id: "60", label: "Motivo del retiro", name: "motivo_de_retiro", type: "text" },
            { id: "61", label: "Estado", name: "estado" },
        ],
    },
];

const totalPages = pageInputs.length;

const SingUpView = ({ handleViewChange }) => {
    const [formData, setFormData] = useState({});
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);

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

    const currentPage = pageInputs[page - 1];
    const isLastPage = page === pageInputs.length;



    const handleSubmit = (event) => {
        event.preventDefault();
        formData.request = "transaction"


        fetch('http://localhost:5000/App', {
            method: 'POST',
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Handle successful response here
            })
            .catch(error => {
                // Handle error here
                console.error('There was a problem submitting the form:', error);
            });
    };

    return (
        <Fade in={open}>
            <Container>

                <Header handleViewChange={handleViewChange}></Header>

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
                    <Box component="form" onSubmit={handleSubmit} sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        height: "25rem",
                        gap: "10px",
                        p: "40px",
                    }}>
                        {currentPage.inputs.map((input) => {
                            if (input.type === 'select') {
                                return (
                                    <TextField
                                        key={input.id}
                                        select
                                        label={input.label}
                                        value={formData[input.name] || ''}
                                        name={input.name}
                                        onChange={handleFormChange}
                                        variant="outlined"

                                    >
                                        {input.options.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                );
                            } else {
                                return (
                                    <TextField
                                        key={input.id}
                                        InputLabelProps={{
                                            shrink: input.shrink,
                                        }}
                                        label={input.label}
                                        value={formData[input.name] || ''}
                                        name={input.name}
                                        type={input.type}
                                        onChange={handleFormChange}
                                        variant="outlined"
                                    />
                                );
                            }
                        })}
                        {isLastPage && (
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        )}
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
