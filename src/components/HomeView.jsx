import React from "react";
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MoreIcon from "@mui/icons-material/More";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Fade from '@mui/material/Fade';
import Cookies from "js-cookie";
import Header from "./Header";
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Modal from '@mui/material/Modal';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';

const HomeView = ({ handleViewChange }) => {

    const [transition, setTransition] = React.useState(false);
    const [tableData, setTableData] = React.useState([]);
    const [access, setAccess] = useState(false)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [openModal, setOpenModal] = React.useState(false);
    const [edit, setEdit] = React.useState(true);
    const [detalles, setDetalles] = React.useState({});

    const handleEdit = () => {
        setEdit(!edit)
    }

    const handleInputChange = (id, value) => {
        setInputs((prevInputs) =>
            prevInputs.map((input) =>
                input.id === id ? { ...input, value: value } : input
            )
        );
    };

    const handleOpenModal = (cedula) => {
        const request_get = {
            "request": "join",
            "cedula": cedula,
            token: Cookies.get('token')
        }
        fetch('http://localhost:5000/App', {
            method: 'POST',
            body: JSON.stringify(request_get),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.data);
                setOpenModal(true)
                setDetalles(data.data[0])
            })
            .catch(error => {
                // Handle error here
                console.error('Hubo un problema: ', error);
            });

    };
    const handleCloseModal = () => {
        setOpenModal(false);
        setEdit(true)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleInhabilitate = () => {
        // Send a POST request to the server
        const dataP = {
            request: "change_state",
            cedula: 1000065648,
            token: Cookies.get('token'),
            change_to: "here_checked",
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
                console.log(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const submit_edit = () => {
        const request_edit = {
            request: "update_transaction",
            token: Cookies.get('token'),
            // Aqui va un objeto que contenga todos los datos, usted decida si los manda dentro de data o no
            // data: {JSON que contiene todos los valores}
            // O los puede mandar diretamente
            // dato1: valor1
            // dato2: valor2
        };
        fetch("http://localhost:5000/App", {
            method: "POST",
            body: JSON.stringify(request_edit),
        })
            .then((response) => {
                // Check if the response was successful
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.status === "success") {
                    handleCloseModal()
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    useEffect(() => {
        const consult = {
            request: "search_employees",
            token: Cookies.get('token'),
        };

        fetch("http://localhost:5000/App", {
            method: "POST",
            body: JSON.stringify(consult),
        })
            .then((response) => {
                // Check if the response was successful
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setTableData(data.data)
                setAccess(true);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        setTransition(!transition)
    }, []);

    const columns = [
        { id: 'cedula', label: 'Cedula', minWidth: 170, align: 'center' },
        { id: 'nombre', label: 'Nombre', minWidth: 100, align: 'center' },
        { id: 'celular', label: 'Celular', minWidth: 100, align: 'center' },
        { id: 'correo', label: 'Correo', minWidth: 100, align: 'center' },
        { id: 'detalles', label: 'Detalles', minWidth: 100, align: 'center' },
        { id: 'estado', label: 'Estado', minWidth: 100, align: 'center' },
    ];

    const pageInputs = [
        // Inputs Pagina Información Personal
        {
            title: "Información Personal",
            inputs: [
                { id: "1", label: "Cedula", name: "cedula", type: "number", tab: 1 },
                { id: "2", label: "Nombre", name: "nombre", type: "text", tab: 3 },
                { id: "3", label: "Fecha de nacimiento", name: "fecha_nacimiento", type: "date", shrink: true },
                {
                    id: "4", label: "Genero", name: "genero", type: "select", options: [
                        { value: 'Femenino', label: 'Femenino' },
                        { value: 'Masculino', label: 'Masculino' },
                    ]
                },
                { id: "5", label: "Edad", name: "edad", type: "number", tab: 2 },
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

    pageInputs.forEach(page => {
        page.inputs.forEach(input => {
            if (input.name in detalles) {
                input.value = detalles[input.name];
            }
        });
    });

    const [inputs, setInputs] = useState(pageInputs);

    const [tableResults, setTableResults] = React.useState([]);

    const rows = tableData.map(([cedula, nombre, celular, correo, estado]) => ({
        cedula,
        nombre,
        celular,
        correo,
        estado: estado === 1 ? true : false,
    }));

    /* Creation of the search function */
    const [searchTerm, setSearchTerm] = useState('');


    if (tableResults.length == 0) {
        console.log("correcto")
    }

    useEffect(() => {
        console.log(searchTerm.length)
        if (tableResults.length == 0 || searchTerm.length < 1) {
            setTableResults(tableResults.concat(rows));
        }
    }, [rows]);


    const search_employees = () => {
        setSearchTerm(event.target.value);

        console.log(searchTerm)
        if (searchTerm.length >= 1) {
            setTableResults(rows.filter(person => {
                for (const key in person) {
                    if (person[key].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                        return true;
                    }
                }
                return false;
            }))
        }
    }


    console.log(tableResults)

    const stylesModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1150,
        height: "80vh",
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: "20px",
        overflow: 'hidden'
    };

    if (access) {
        return (
            <Fade in={transition}>
                <Container>
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        sx={{ display: "flex", borderRadius: "30px" }}
                    >
                        <Box sx={stylesModal}>
                            <Button title="Editar" onClick={() => handleEdit()}>
                                <EditIcon></EditIcon>
                            </Button>
                            <List sx={{ overflow: 'auto', maxHeight: "515px" }}>
                                <Typography sx={{ display: "flex", justifyContent: "center" }} id="modal-modal-title" variant="h5" component="h3">
                                    Detalles del empleado
                                </Typography>
                                <Box sx={{ p: 2 }}>
                                    {pageInputs.map((section) => (
                                        <Box key={section.title} sx={{ mb: 2, display: "flex", flexWrap: "wrap", width: "100%" }}>
                                            <Typography sx={{ display: "flex", justifyContent: "center", width: "100%" }} variant="h6" component="h3">{section.title}</Typography>
                                            {section.inputs.map((input) => (
                                                <Box key={input.id} sx={{ m: 2 }}>
                                                    {input.id == 1
                                                        ?
                                                        <TextField disabled label={input.label} type={input.type} value={input.value} sx={{ width: "220px" }}>
                                                        </TextField>
                                                        :
                                                        input.type == "select" ?
                                                            <TextField
                                                                sx={{ width: "220px" }}
                                                                key={input.id}
                                                                select
                                                                label={input.label}
                                                                value={input.value}
                                                                name={input.name}
                                                                variant="outlined"
                                                                onChange={(e) => handleInputChange(input.id, e.target.value)}
                                                                disabled={edit}
                                                            >
                                                                {
                                                                    input.options.map((option) => (
                                                                        <MenuItem key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </MenuItem>
                                                                    ))
                                                                }
                                                            </TextField>
                                                            :
                                                            <TextField disabled={edit} onChange={(e) => handleInputChange(input.id, e.target.value)} label={input.label} type={input.type} value={input.value} sx={{ width: "220px" }}>
                                                            </TextField>}
                                                </Box>
                                            ))}
                                        </Box>
                                    ))}
                                </Box>
                            </List>

                            <Box sx={{ display: "flex", justifyContent: "flex-end", mx: "50px" }}>
                                <Button disabled={edit} onClick={() => submit_edit()}>
                                    <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                                        <SaveIcon />
                                    </Box>
                                    Guardar
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    <Header handleViewChange={handleViewChange} logoRedirection={"HomeView"}></Header>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                width: "500px",
                            }}
                        >
                            <TextField
                                autoFocus
                                label="Cedula de ciudadania del empleado"
                                fullWidth
                                value={searchTerm}
                                onChange={search_employees}
                                variant="standard"
                                sx={{
                                    display: "flex",
                                    textAlign: "center",
                                }}
                            ></TextField>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button onClick={() => handleViewChange("SingUpView")}>
                            <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                                <PersonAddIcon />
                            </Box>
                            Añadir
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            height: 600,
                        }}
                    >

                        <Paper elevation={0} sx={{ width: '100%', }}>
                            <TableContainer sx={{ maxHeight: 550, width: "100%" }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableResults
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.cedula}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {column.id === 'detalles'
                                                                        ?
                                                                        <Button title="Detalles" onClick={() => handleOpenModal(row.cedula)}>
                                                                            <MoreIcon></MoreIcon>
                                                                        </Button>
                                                                        // : column.id === 'editar'
                                                                        //     ? <Button title="Editar" onClick={() => handleViewChange("EditView")}>
                                                                        //         <EditIcon ></EditIcon>
                                                                        //     </Button> 
                                                                        :
                                                                        column.id === 'estado'
                                                                            ?
                                                                            <Switch></Switch>
                                                                            :
                                                                            value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                sx={{ display: "flex", justifyContent: "center" }}
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={tableResults.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Box>
                </Container>
            </Fade >
        );
    }
};

export default HomeView;


