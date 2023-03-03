import React from "react";
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Pagination } from "@mui/material";
import TextField from "@mui/material/TextField";
import Fade from '@mui/material/Fade';
import Header from "./Header";
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import Cookies from "js-cookie";

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
        ],
    },
    {
        title: "Información Personal",
        inputs: [
            {
                id: "8", label: "Estado Civil", name: "estado_civil", type: "select", options: [
                    { value: 'Soltero', label: 'Soltero' },
                    { value: 'Casado', label: 'Casado' },
                    { value: 'Divorciado', label: 'Divorciado' },
                    { value: 'Viudo', label: 'Viudo' },
                    { value: 'Concubinato', label: 'Concubinato' },
                ]
            },
            { id: "9", label: "Hijos", name: "hijos", type: "number" },
            { id: "510", label: "Personas a cargo", name: "personas_a_cargo", type: "number" },
            {
                id: "10", label: "Estrato", name: "estrato", type: "select", options: [
                    { value: '1', label: 'Estrato 1' },
                    { value: '2', label: 'Estrato 2' },
                    { value: '3', label: 'Estrato 3' },
                    { value: '4', label: 'Estrato 4' },
                    { value: '5', label: 'Estrato 5' },
                    { value: '6', label: 'Estrato 6' },
                ]
            },
            { id: "11", label: "Telefono Fijo", name: "tel_fijo", type: "number" },
            { id: "12", label: "Celular", name: "celular", type: "text" },
        ],
    },
    {
        title: "Información Personal",
        inputs: [
            { id: "13", label: "Correo", name: "correo", type: "email" },
            { id: "14", label: "Direccion", name: "direccion", type: "text" },
            { id: "15", label: "Barrio", name: "barrio", type: "text" },
            { id: "16", label: "Contacto de emergencia", name: "contacto_emergencia", type: "text" },
            { id: "17", label: "Parentesco", name: "parentesco", type: "text" },
            { id: "18", label: "Telefono de contacto", name: "tel_contacto", type: "number" },
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
            { id: "pension", label: "Pension", name: "pension", type: "number" },
            { id: "cesantias", label: "Cesantias", name: "cesantias", type: "number" },
            { id: "cambio_eps_pension_fecha", label: "Cambio de eps y fecha de pension", name: "cambio_eps_pension_fecha", type: "date", shrink: true },
        ],
    },
    {
        title: "Información Empleado",
        inputs: [
            { id: "cuenta_nomina", label: "Cuenta nomina", name: "cuenta_nomina", type: "number" },
            { id: "fecha_ingreso", label: "Fecha de ingreso", name: "fecha_ingreso", type: "date", shrink: true },
            {
                id: "cargo", label: "Cargo", name: "cargo", type: "select", options: [
                    { value: 'Analista de Aplicaciones de Contact Center', label: 'Analista de Aplicaciones de Contact Center' },
                    { value: 'Analista de BD y Aplicaciones', label: 'Analista de BD y Aplicaciones' },
                    { value: 'Analista de Investigación', label: 'Analista de Investigación' },
                    { value: 'Analista de Saneamiento', label: 'Analista de Saneamiento' },
                    { value: 'Analista de Soporte', label: 'Analista de Soporte' },
                    { value: 'Analista Gestión Humana', label: 'Analista Gestión Humana' },
                    { value: 'Analista Jurídico', label: 'Analista Jurídico' },
                    { value: 'Asesor(a) Comercial', label: 'Asesor(a) Comercial' },
                    { value: 'Asesor(a) de Negociación', label: 'Asesor(a) de Negociación' },
                    { value: 'Asesor(a) de Negociación jr', label: 'Asesor(a) de Negociación jr' },
                    { value: 'Asesor(a) Senior', label: 'Asesor(a) Senior' },
                    { value: 'Auxiliar Administrativo', label: 'Auxiliar Administrativo' },
                    { value: 'Auxiliar de Licitación', label: 'Auxiliar de Licitación' },
                    { value: 'Auxiliar de Recursos Físicos', label: 'Auxiliar de Recursos Físicos' },
                    { value: 'Auxiliar Operativo', label: 'Auxiliar Operativo' },
                    { value: 'Back Office', label: 'Back Office' },
                    { value: 'Coordinador Contable', label: 'Coordinador Contable' },
                    { value: 'Coordinador de Capacitación', label: 'Coordinador de Capacitación' },
                    { value: 'Coordinador(a) BI', label: 'Coordinador(a) BI' },
                    { value: 'Coordinador(a) de BackOffice', label: 'Coordinador(a) de BackOffice' },
                    { value: 'Coordinador(a) de Investigaciones', label: 'Coordinador(a) de Investigaciones' },
                    { value: 'Coordinador(a) de Planeación y Calidad', label: 'Coordinador(a) de Planeación y Calidad' },
                    { value: 'Coordinador(a) de Proyecto', label: 'Coordinador(a) de Proyecto' },
                    { value: 'Data Marshall', label: 'Data Marshall' },
                    { value: 'Director(a) Analitycs', label: 'Director(a) Analitycs' },
                    { value: 'Director(a) de Investigaciones', label: 'Director(a) de Investigaciones' },
                    { value: 'Director(a) de Proyecto', label: 'Director(a) de Proyecto' },
                    { value: 'Director(a) de Recursos Físicos', label: 'Director(a) de Recursos Físicos' },
                    { value: 'Director(a) de SST', label: 'Director(a) de SST' },
                    { value: 'Director(a) Jurídico', label: 'Director(a) Jurídico' },
                    { value: 'Formador', label: 'Formador' },
                    { value: 'Gerente Administrativa', label: 'Gerente Administrativa' },
                    { value: 'Gerente de Control Interno', label: 'Gerente de Control Interno' },
                    { value: 'Gerente de cuentas', label: "Gerente de cuentas" },
                    { value: 'Gerente de Gestión Humana', label: "Gerente de Gestión Humana" },
                    { value: 'Gerente de Legal y de Riesgo', label: "Gerente de Legal y de Riesgo" },
                    { value: 'Gerente de Mercadeo', label: "Gerente de Mercadeo" },
                    { value: 'Gerente de Operaciones', label: "Gerente de Operaciones" },
                    { value: 'Gerente de Planeación', label: "Gerente de Planeación" },
                    { value: 'Gerente de Tecnología', label: "Gerente de Tecnología" },
                    { value: 'Gerente General', label: "Gerente General" },
                    { value: 'Gerente Jr Infraestructura y Redes', label: "Gerente Jr Infraestructura y Redes" },
                    { value: 'Gerente jr. de Aplicaciones de Contact Center', label: "Gerente jr.de Aplicaciones de Contact Center" },
                    { value: 'Gerente jr. de Mesa de Servicio', label: "Gerente jr.de Mesa de Servicio" },
                    { value: 'Operador Logístico', label: "Operador Logístico" },
                    { value: 'Presidente', label: "Presidente" },
                    { value: 'Sena Lectiva', label: "Sena Lectiva" },
                    { value: 'Sena Productiva', label: "Sena Productiva" },
                    { value: 'Servicios Generales', label: "Servicios Generales" },
                    { value: 'Supernumerario', label: "Supernumerario" },
                    { value: 'Supervisor(a) de Calidad', label: "Supervisor(a) de Calidad" },
                    { value: 'en blanco', label: "En blanco" },
                ]
            },
            {
                id: "gerencia", label: "Gerencia", name: "gerencia", type: "select", options: [
                    { value: 'Gerencia de Planeación', label: "Gerencia de Planeación" },
                    { value: 'Gerencia Administrativa', label: "Gerencia Administrativa" },
                    { value: 'Gerencia de Legal y Riesgo', label: "Gerencia de Legal y Riesgo" },
                    { value: 'Gerencia de Tecnología', label: "Gerencia de Tecnología" },
                    { value: 'Gerencia Gestión Humana', label: "Gerencia Gestión Humana" },

                ]
            },
            {
                id: "campana_general", label: "Campaña general", name: "campana_general", type: "select", options: [
                    { value: 'MetLife', label: "MetLife" },
                    { value: 'BBVA Digital', label: "BBVA Digital" },
                    { value: 'Pay-U', label: "Pay-U" },
                    { value: 'Liberty', label: "Liberty" },
                    { value: 'Congente', label: "Congente" },
                    { value: 'Yanbal', label: "Yanbal" },
                    { value: 'Falabella', label: "Falabella" },
                    { value: 'Falabella Peru', label: "Falabella Peru" },
                    { value: 'Credibanco', label: "Credibanco" },
                    { value: 'Nueva EPS', label: "Nueva EPS" },
                    { value: 'Claro', label: "Claro" },
                    { value: 'Avantel', label: "Avantel" },
                    { value: 'Coomeva', label: "Coomeva" },
                    { value: 'Azteca', label: "Azteca" },
                    { value: 'Scotiabank Colpatria', label: "Scotiabank Colpatria" },
                    { value: 'Banco Agrario', label: "Banco Agrario" },
                ]
            },
        ],
    },
    {
        title: "Información Empleado",
        inputs: [
            { id: "area_negocio", label: "Area de negocio", name: "area_negocio", type: "text" },
            {
                id: "tipo_contrato", label: "Tipo de contrato", name: "tipo_contrato", type: "select", options: [
                    { value: 'Contrato a término indefinido', label: "Contrato a término indefinido" },
                    { value: 'Contrato a término fijo', label: "Contrato a término fijo" },
                    { value: 'Contrato temporal', label: "Contrato temporal" },
                    { value: 'Contrato por obra o labor', label: "Contrato por obra o labor" },
                    { value: 'Contrato civil por prestación de servicios', label: "Contrato civil por prestación de servicios" },
                    { value: 'Contrato ocasional', label: "Contrato ocasional" },
                    { value: 'Contrato de aprendizaje', label: "Contrato de aprendizaje" },
                    { value: 'Contrato sindical', label: "Contrato sindical" },
                ]
            },
            { id: "salario_2023", label: "Salario 2023", name: "salario_2023", type: "number" },
            { id: "subsidio_transporte_2023", label: "Subsidio de transporte 2023", name: "subsidio_transporte_2023", type: "number" },
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
                type: "number"
            },
            {
                id: "55",
                label: "Periodos faltantes de vacaciones",
                name: "periodos_faltantes_vacaciones",
                type: "number"
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
            {
                id: "61", label: "Estado", name: "estado", type: "select", options: [
                    { value: '1', label: 'Activo' },
                    { value: '0', label: 'Inactivo' },
                ]
            },
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
        formData.request = "insert_transaction"
        formData.token = Cookies.get('token')

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

                <Header handleViewChange={handleViewChange} logoRedirection={"HomeView"} pointer={true}></Header>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant="h3" gutterBottom>
                        Registrar <b>Usuarios</b>
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
                        height: "100%",
                        flexDirection: "column",
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
                                        required
                                    >
                                        {
                                            input.options.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))
                                        }
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
                                        inputProps={{ min: "0" }}
                                        required
                                        variant="outlined"
                                        width="100px"
                                    />
                                );
                            }
                        })}
                        {isLastPage && (
                            <Button type="submit" variant="contained" color="primary">
                                <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                                    <SaveIcon></SaveIcon>
                                </Box>
                                Guardar
                            </Button>
                        )}
                    </Box>

                    <Pagination
                        sx={{
                            display: "flex", width: "100%", justifyContent: "center"
                        }}
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                    />
                </Box>
            </Container>
        </Fade >
    );
};

export default SingUpView;
