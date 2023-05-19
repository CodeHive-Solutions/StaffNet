import React from "react";
import UploadIcon from "@mui/icons-material/Upload";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState, useCallback } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import MoreIcon from "@mui/icons-material/More";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Fade from "@mui/material/Fade";
import Header from "./Header";
import Switch from "@mui/material/Switch";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import SnackAlert from "./SnackAlert";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const HomeView = () => {
    const [formData, setFormData] = useState({});
    const [detalles, setDetalles] = React.useState({});
    const [inputValues, setInputValues] = useState({});
    const [rows, setRows] = useState([]);
    const [tableData, setTableData] = React.useState([]);
    const [tableResults, setTableResults] = React.useState([]);
    const [edit, setEdit] = React.useState(true);
    const [access, setAccess] = useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [transition, setTransition] = React.useState(false);
    const [openModalAdd, setOpenModalAdd] = React.useState(false);
    const [messageAlert, setMessageAlert] = React.useState(false);
    const [openSnackAlert, setOpenSnackAlert] = React.useState(false);
    const [progressBar, setProgressBar] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [permissions, setPermissions] = useState("");
    const [dataCalculateAge, setDataCalculateAge] = useState();
    const [seniority, setSeniority] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [severityAlert, setSeverityAlert] = React.useState("info");
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("https://staffnetback.cyc-bpo.com//search_employees", {
                    method: "POST",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const data = await response.json();
                if ("info" in data) {
                    setAccess(true);
                    setTableData(data.info.data);
                    setPermissions(data.permissions);
                } else if (data.error === "conexion") {
                    console.error("error:" + data + data.error);
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
                if (error === "Usuario no ha iniciado sesion") {
                    navigate("/");
                }
            }
            setTransition(!transition);
        };
        fetchEmployees();

        const intervalId = setInterval(() => {
            fetchEmployees();
        }, 10 * 30 * 1000);
        return () => clearTimeout(intervalId);
    }, []);

    const calculateAge = (birthdate) => {
        // Split birthdate string into array of year, month, and day
        const [year, month, day] = birthdate.split("-");
        // Calculate today's date
        const today = new Date();
        // Calculate the age based on birthdate and today's date
        let age = today.getFullYear() - year;
        const monthDiff = today.getMonth() - (month - 1);
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
            age--;
        }
        return age;
    };
    const calculateSeniority = (seniority) => {
        if (!isNaN(seniority) && seniority !== undefined) {
            const fechaIngreso = new Date(seniority);
            const fechaActual = new Date();
            const antiguedadEnAños = fechaActual.getFullYear() - fechaIngreso.getFullYear();
            setSeniority(antiguedadEnAños);
        }
    };
    const handleOpenModalAdd = () => {
        setOpenModalAdd(true);
        setFormData({});
    };
    const handleCloseModalAdd = () => setOpenModalAdd(false);
    const handleCloseSnack = () => setOpenSnackAlert(false);
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleEdit = () => setEdit(!edit);
    const setShowSnackAlert = (severity, message, errorDev) => {
        setSeverityAlert(severity);
        setMessageAlert(message);
        setOpenSnackAlert(true);
        if (errorDev === true) {
            setProgressBar(false);
            console.error("error:", message);
        }
    };
    const handleOpenModal = (cedula) => {
        setProgressBar(true);
        const request_get = {
            cedula: cedula,
        };
        const getJoinInfo = async () => {
            try {
                const response = await fetch("https://staffnetback.cyc-bpo.com//get_join_info", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(request_get),
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (data.status === "success") {
                    setProgressBar(false);
                    setDetalles(data.data[0]);
                    setOpenModal(true);
                } else {
                    setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + data.error, true);
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
            }
        };
        getJoinInfo();
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        setEdit(true);
        setDetalles({});
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const columns = [
        { field: "cedula", headerName: "Cedula", width: 120 },
        { field: "nombre", headerName: "Nombre", width: 230 },
        { field: "correo", headerName: "Correo", width: 230 },
        { field: "campana", headerName: "Campaña", width: 100 },
        { field: "gerencia", headerName: "Gerencia", width: 100 },
        { field: "cargo", headerName: "Cargo", width: 170 },
        {
            field: "detalles",
            headerName: "Detalles",
            width: 65,
            renderCell: (params) => {
                const { row } = params;
                return (
                    <Tooltip title="Detalles">
                        <IconButton color="primary" onClick={() => handleOpenModal(row.cedula)}>
                            <MoreIcon />
                        </IconButton>
                    </Tooltip>
                );
            },
        },

        {
            field: "estado",
            headerName: "Estado",
            width: 80,
            renderCell: (params) => {
                const { row } = params;
                if (permissions.disable == 1) {
                    return (
                        <Tooltip title={row.estado ? "Inhabilitar" : "Habilitar"}>
                            <Switch checked={row.estado} onChange={() => handleSwitch(row)} />
                        </Tooltip>
                    );
                } else {
                    return <Switch disabled checked={row.estado} />;
                }
            },
        },
    ];

    const pageInputs = [
        // Inputs Pagina Información Personal
        {
            title: "Información Personal",
            inputs: [
                {
                    id: "tipo_documento",
                    label: "Tipo de documento",
                    name: "tipo_documento",
                    type: "select",
                    options: [
                        { value: "CC", label: "CC" },
                        { value: "CE", label: "CE" },
                        { value: "TI", label: "TI" },
                    ],
                },
                {
                    id: "1",
                    label: "Cedula",
                    name: "cedula",
                    type: "text",
                },
                {
                    id: "fecha_expedicion",
                    label: "Fecha de expedition",
                    name: "fecha_expedicion",
                    type: "date",
                    shrink: true,
                },
                {
                    id: "2",
                    label: "Nombre",
                    name: "nombre",
                    type: "text",
                },
                {
                    id: "3",
                    label: "Fecha de nacimiento",
                    name: "fecha_nacimiento",
                    type: "date",
                    shrink: true,
                    value: "",
                },
                {
                    id: "4",
                    label: "Genero",
                    name: "genero",
                    type: "select",
                    options: [
                        { value: "Femenino", label: "Femenino" },
                        { value: "Masculino", label: "Masculino" },
                    ],
                },
                { id: "5", label: "Edad", name: "edad", type: "number" },
                {
                    id: "7",
                    label: "RH",
                    name: "rh",
                    type: "select",
                    options: [
                        { value: "O+", label: "O+" },
                        { value: "O-", label: "O-" },
                        { value: "A+", label: "A-" },
                        { value: "B+", label: "B+" },
                        { value: "B-", label: "B-" },
                        { value: "AB+", label: "AB+" },
                        { value: "AB-", label: "AB-" },
                    ],
                },
                {
                    id: "8",
                    label: "Estado Civil",
                    name: "estado_civil",
                    type: "select",
                    options: [
                        { value: "Casado(a)", label: "Casado(a)" },
                        { value: "Divorciado(a)", label: "Divorciado(a)" },
                        { value: "Separado(a)", label: "Separado(a)" },
                        { value: "Soltero(a)", label: "Soltero(a)" },
                        { value: "Union Libre(a)", label: "Union Libre" },
                        { value: "Viudo(a)", label: "Viudo(a)" },
                    ],
                },
                {
                    id: "9",
                    label: "Hijos",
                    name: "hijos",
                    type: "select",
                    options: [
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" },
                    ],
                },
                {
                    id: "510",
                    label: "Personas a cargo",
                    name: "personas_a_cargo",
                    type: "select",
                    options: [
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" },
                    ],
                },
                {
                    id: "10",
                    label: "Estrato",
                    name: "estrato",
                    type: "select",
                    options: [
                        { value: "1", label: "Estrato 1" },
                        { value: "2", label: "Estrato 2" },
                        { value: "3", label: "Estrato 3" },
                        { value: "4", label: "Estrato 4" },
                        { value: "5", label: "Estrato 5" },
                        { value: "6", label: "Estrato 6" },
                    ],
                },
                {
                    id: "11",
                    label: "Telefono Fijo",
                    name: "tel_fijo",
                    type: "number",
                },
                { id: "12", label: "Celular", name: "celular", type: "text" },
                { id: "13", label: "Correo", name: "correo", type: "email" },
                {
                    id: "correo_corporativo",
                    label: "Correo Corporativo",
                    name: "correo_corporativo",
                    type: "email",
                },
                {
                    id: "14",
                    label: "Direccion",
                    name: "direccion",
                    type: "text",
                },
                { id: "15", label: "Barrio", name: "barrio", type: "text" },
                {
                    id: "16",
                    label: "Contacto de emergencia",
                    name: "contacto_emergencia",
                    type: "text",
                },
                {
                    id: "17",
                    label: "Parentesco",
                    name: "parentesco",
                    type: "select",
                    options: [
                        { value: "Abuelo(a)", label: "Abuelo(a)" },
                        { value: "Amigo(a)", label: "Amigo(a)" },
                        { value: "Esposo(a)", label: "Esposo(a)" },
                        { value: "Familiar(a)", label: "Familiar" },
                        { value: "Hermano(a)", label: "Hermano(a)" },
                        { value: "Hijo(a)", label: "Hijo(a)" },
                        { value: "Madre(a)", label: "Madre(a)" },
                        { value: "Padre(a)", label: "Padre(a)" },
                        { value: "Pareja(a)", label: "Pareja(a)" },
                        { value: "Primo(a)", label: "Primo(a)" },
                        { value: "Tio(a)", label: "Tio(a)" },
                    ],
                },
                {
                    id: "18",
                    label: "Telefono de contacto",
                    name: "tel_contacto",
                    type: "number",
                },
            ],
        },
        // Inputs Pagina Información Educativa
        {
            title: "Información Educativa",
            inputs: [
                {
                    id: "19",
                    label: "Nivel de escolaridad",
                    name: "nivel_escolaridad",
                    type: "select",
                    options: [
                        { value: "Primaria", label: "Primaria" },
                        { value: "Bachiller", label: "Bachiller" },
                        { value: "Técnico", label: "Técnico" },
                        { value: "Tecnólogo", label: "Tecnólogo" },
                        { value: "Auxiliar", label: "Auxiliar" },
                        { value: "Universitario(a)", label: "Universitario" },
                        { value: "Profesional", label: "Profesional" },
                        { value: "Especialización", label: "Especialización" },
                    ],
                },
                {
                    id: "20",
                    label: "Profesión",
                    name: "Profesión",
                    type: "text",
                },
                {
                    id: "21",
                    label: "Estudios en curso",
                    name: "estudios_en_curso",
                    type: "text",
                },
            ],
        },
        // Inputs Pagina Información Empleado
        {
            title: "Información Empleado",
            inputs: [
                {
                    id: "sede",
                    label: "Sede",
                    name: "sede",
                    type: "select",
                    options: [
                        { value: "bogota", label: "Bogotá D.C" },
                        { value: "bucaramanga", label: "Bucaramanga" },
                        { value: "medellin", label: "Medellin" },
                    ],
                },
                {
                    id: "fecha_afiliacion",
                    label: "Fecha de Afiliacion",
                    name: "fecha_afiliacion",
                    type: "date",
                    shrink: true,
                },
                {
                    id: "antiguedad",
                    label: "Antiguedad",
                    name: "antiguedad",
                    type: "number",
                    shrink: true,
                },
                {
                    id: "eps",
                    label: "EPS",
                    name: "eps",
                    type: "select",
                    options: [
                        { value: "ASMET_SALUD", label: "ASMET SALUD" },
                        { value: "CAPITAL_SALUD", label: "CAPITAL SALUD" },
                        { value: "COMPENSAR", label: "COMPENSAR" },
                        { value: "COOSALUD", label: "COOSALUD" },
                        { value: "COMPENSAR", label: "COMPENSAR" },
                        { value: "FAMISANAR", label: "FAMISANAR" },
                        { value: "N/A", label: "N/A" },
                        { value: "NUEVA_EPS", label: "NUEVA EPS" },
                        { value: "SALUD_TOTAL", label: "SALUD TOTAL" },
                        { value: "SANITAS", label: "SANITAS" },
                        { value: "SURA_EPS", label: "SURA EPS" },
                    ],
                },
                {
                    id: "pension",
                    label: "Pension",
                    name: "pension",
                    type: "select",
                    options: [
                        { value: "COLFONDOS", label: "COLFONDOS" },
                        { value: "N/A", label: "N/A" },
                        { value: "OLD MUTUAL", label: "OLD MUTUAL" },
                        { value: "PORVENIR", label: "PORVENIR" },
                        { value: "PROTECCIÓN", label: "PROTECCIÓN" },
                        { value: "SKANDIA", label: "SKANDIA" },
                    ],
                },
                {
                    id: "caja_compensacion",
                    label: "Caja de Compensacion",
                    name: "caja_compensacion",
                    type: "text",
                },
                {
                    id: "cesantias",
                    label: "Cesantias",
                    name: "cesantias",
                    type: "select",
                    options: [
                        { value: "COLFONDOS", label: "COLFONDOS" },
                        { value: "FNA", label: "FNA" },
                        { value: "PORVENIR", label: "PORVENIR" },
                        { value: "N/A", label: "N/A" },
                        { value: "PROTECCIÓN", label: "PROTECCIÓN" },
                    ],
                },
                {
                    id: "cambio_eps_pension_fecha",
                    label: "Cambio de eps y fecha de pension",
                    name: "cambio_eps_pension_fecha",
                    type: "date",
                    shrink: true,
                },
                {
                    id: "cuenta_nomina",
                    label: "Cuenta nomina",
                    name: "cuenta_nomina",
                    type: "number",
                },
                {
                    id: "fecha_ingreso",
                    label: "Fecha de ingreso",
                    name: "fecha_ingreso",
                    type: "date",
                    shrink: true,
                },
                {
                    id: "cargo",
                    label: "Cargo",
                    name: "cargo",
                    type: "select",
                    options: [
                        {
                            value: "Analista de Aplicaciones de Contact Center",
                            label: "Analista de Aplicaciones de Contact Center",
                        },
                        {
                            value: "Analista de BD y Aplicaciones",
                            label: "Analista de BD y Aplicaciones",
                        },
                        {
                            value: "Analista de Investigación",
                            label: "Analista de Investigación",
                        },
                        {
                            value: "Analista de Saneamiento",
                            label: "Analista de Saneamiento",
                        },
                        {
                            value: "Analista de Soporte",
                            label: "Analista de Soporte",
                        },
                        {
                            value: "Analista Gestión Humana",
                            label: "Analista Gestión Humana",
                        },
                        {
                            value: "Analista Jurídico",
                            label: "Analista Jurídico",
                        },
                        {
                            value: "Asesor(a) Comercial",
                            label: "Asesor(a) Comercial",
                        },
                        {
                            value: "Asesor(a) de Negociación",
                            label: "Asesor(a) de Negociación",
                        },
                        {
                            value: "Asesor(a) de Negociación jr",
                            label: "Asesor(a) de Negociación jr",
                        },
                        {
                            value: "Asesor(a) Senior",
                            label: "Asesor(a) Senior",
                        },
                        {
                            value: "Auxiliar Administrativo",
                            label: "Auxiliar Administrativo",
                        },
                        {
                            value: "Auxiliar de Licitación",
                            label: "Auxiliar de Licitación",
                        },
                        {
                            value: "Auxiliar de Recursos Físicos",
                            label: "Auxiliar de Recursos Físicos",
                        },
                        {
                            value: "Auxiliar Operativo",
                            label: "Auxiliar Operativo",
                        },
                        { value: "Back Office", label: "Back Office" },
                        {
                            value: "Coordinador Contable",
                            label: "Coordinador Contable",
                        },
                        {
                            value: "Coordinador de Capacitación",
                            label: "Coordinador de Capacitación",
                        },
                        {
                            value: "Coordinador(a) BI",
                            label: "Coordinador(a) BI",
                        },
                        {
                            value: "Coordinador(a) de BackOffice",
                            label: "Coordinador(a) de BackOffice",
                        },
                        {
                            value: "Coordinador(a) de Investigaciones",
                            label: "Coordinador(a) de Investigaciones",
                        },
                        {
                            value: "Coordinador(a) de Planeación y Calidad",
                            label: "Coordinador(a) de Planeación y Calidad",
                        },
                        {
                            value: "Coordinador(a) de Proyecto",
                            label: "Coordinador(a) de Proyecto",
                        },
                        { value: "Data Marshall", label: "Data Marshall" },
                        {
                            value: "Director(a) Analitycs",
                            label: "Director(a) Analitycs",
                        },
                        {
                            value: "Director(a) de Investigaciones",
                            label: "Director(a) de Investigaciones",
                        },
                        {
                            value: "Director(a) de Proyecto",
                            label: "Director(a) de Proyecto",
                        },
                        {
                            value: "Director(a) de Recursos Físicos",
                            label: "Director(a) de Recursos Físicos",
                        },
                        {
                            value: "Director(a) de SST",
                            label: "Director(a) de SST",
                        },
                        {
                            value: "Director(a) Jurídico",
                            label: "Director(a) Jurídico",
                        },
                        { value: "Formador", label: "Formador" },
                        {
                            value: "Gerente Administrativa",
                            label: "Gerente Administrativa",
                        },
                        {
                            value: "Gerente de Control Interno",
                            label: "Gerente de Control Interno",
                        },
                        {
                            value: "Gerente de cuentas",
                            label: "Gerente de cuentas",
                        },
                        {
                            value: "Gerente de Gestión Humana",
                            label: "Gerente de Gestión Humana",
                        },
                        {
                            value: "Gerente de Legal y de Riesgo",
                            label: "Gerente de Legal y de Riesgo",
                        },
                        {
                            value: "Gerente de Mercadeo",
                            label: "Gerente de Mercadeo",
                        },
                        {
                            value: "Gerente de Operaciones",
                            label: "Gerente de Operaciones",
                        },
                        {
                            value: "Gerente de Planeación",
                            label: "Gerente de Planeación",
                        },
                        {
                            value: "Gerente de Tecnología",
                            label: "Gerente de Tecnología",
                        },
                        { value: "Gerente General", label: "Gerente General" },
                        {
                            value: "Gerente Jr Infraestructura y Redes",
                            label: "Gerente Jr Infraestructura y Redes",
                        },
                        {
                            value: "Gerente jr. de Aplicaciones de Contact Center",
                            label: "Gerente jr.de Aplicaciones de Contact Center",
                        },
                        {
                            value: "Gerente jr. de Mesa de Servicio",
                            label: "Gerente jr.de Mesa de Servicio",
                        },
                        {
                            value: "Operador Logístico",
                            label: "Operador Logístico",
                        },
                        { value: "Presidente", label: "Presidente" },
                        { value: "Sena Lectiva", label: "Sena Lectiva" },
                        { value: "Sena Productiva", label: "Sena Productiva" },
                        {
                            value: "Servicios Generales",
                            label: "Servicios Generales",
                        },
                        { value: "Supernumerario", label: "Supernumerario" },
                        {
                            value: "Supervisor(a) de Calidad",
                            label: "Supervisor(a) de Calidad",
                        },
                        { value: "en blanco", label: "En blanco" },
                    ],
                },
                {
                    id: "gerencia",
                    label: "Gerencia",
                    name: "gerencia",
                    type: "select",
                    options: [
                        {
                            value: "Planeación",
                            label: "Planeación",
                        },
                        {
                            value: "Administrativa",
                            label: "Administrativa",
                        },
                        {
                            value: "Legal_Riesgo",
                            label: "Legal y Riesgo",
                        },
                        {
                            value: "Tecnología",
                            label: "Tecnología",
                        },
                        {
                            value: "Gestión_Humana",
                            label: "Gestión Humana",
                        },
                        {
                            value: "Azteca",
                            label: "Azteca",
                        },
                        {
                            value: "Banco_Agrario",
                            label: "Banco Agrario",
                        },
                        {
                            value: "BBVA",
                            label: "BBVA",
                        },
                        {
                            value: "Claro",
                            label: "Claro",
                        },
                        {
                            value: "Claro_Digital",
                            label: "Claro Digital",
                        },
                        {
                            value: "Codensa",
                            label: "Codensa",
                        },
                        {
                            value: "Coomeva_Cartera",
                            label: "Coomeva Cartera",
                        },
                        {
                            value: "Coomeva_CEM",
                            label: "Coomeva CEM",
                        },
                        {
                            value: "Coomeva_MP",
                            label: "Coomeva MP",
                        },
                        {
                            value: "Credibanco",
                            label: "Credibanco",
                        },
                        {
                            value: "Dinerum",
                            label: "Dinerum",
                        },
                        {
                            value: "Falabella",
                            label: "Falabella",
                        },
                        {
                            value: "Falabella_Medellín",
                            label: "Falabella Medellín",
                        },
                        {
                            value: "Dinerum",
                            label: "Dinerum",
                        },
                        {
                            value: "Finandina",
                            label: "Finandina",
                        },
                        {
                            value: "Gerencia_Administrativa",
                            label: "Gerencia Administrativa",
                        },
                        {
                            value: "Gerencia_Legal_Riesgo",
                            label: "Gerencia de Legal y Riesgo",
                        },
                        {
                            value: "Gerencia_Mercadeo",
                            label: "Gerencia de Mercadeo",
                        },
                        {
                            value: "Gerencia_Operaciones",
                            label: "Gerencia de peraciones",
                        },
                        {
                            value: "Gerencia_Planeación",
                            label: "Gerencia de Planeación",
                        },
                        {
                            value: "Gerencia_Riesgo_Control_Interno",
                            label: "Gerencia de Riesgo y Control Interno",
                        },
                        {
                            value: "Gerencia_Tecnología",
                            label: "Gerencia de Tecnología",
                        },
                        {
                            value: "Gerencia_General",
                            label: "Gerencia General",
                        },
                        {
                            value: "Gerencia_Gestión_Humana",
                            label: "Gerencia Gestión Humana",
                        },
                        {
                            value: "Liberty",
                            label: "Liberty",
                        },
                        {
                            value: "MetLife",
                            label: "MetLife",
                        },
                        {
                            value: "Nueva_EPS",
                            label: "Nueva EPS",
                        },
                        {
                            value: "Pay_U",
                            label: "Pay-U",
                        },
                        {
                            value: "Presidencial",
                            label: "Presidencial",
                        },
                        {
                            value: "Recursos_Físicos ",
                            label: "Recursos Físicos ",
                        },
                        {
                            value: "Scotiabank_Colpatria",
                            label: "Scotiabank Colpatria",
                        },
                        {
                            value: "Sura",
                            label: "Sura",
                        },
                        {
                            value: "Yanbal_Bogotá",
                            label: "Yanbal Bogotá",
                        },
                        {
                            value: "Yanbal_Bucaramanga",
                            label: "Yanbal Bucaramanga",
                        },
                        {
                            value: "Yanbal_Ibague",
                            label: "Yanbal Ibague",
                        },
                        {
                            value: "Yanbal_Medellín",
                            label: "Yanbal Medellín",
                        },
                        {
                            value: "Yanbal_Villavicencio",
                            label: "Yanbal Villavicencio",
                        },
                    ],
                },
                {
                    id: "campana_general",
                    label: "Campaña general",
                    name: "campana_general",
                    type: "select",
                    options: [
                        {
                            value: "Planeación",
                            label: "Planeación",
                        },
                        {
                            value: "Administrativa",
                            label: "Administrativa",
                        },
                        {
                            value: "Legal_Riesgo",
                            label: "Legal y Riesgo",
                        },
                        {
                            value: "Tecnología",
                            label: "Tecnología",
                        },
                        {
                            value: "Gestión_Humana",
                            label: "Gestión Humana",
                        },
                        {
                            value: "Azteca",
                            label: "Azteca",
                        },
                        {
                            value: "Banco_Agrario",
                            label: "Banco Agrario",
                        },
                        {
                            value: "BBVA",
                            label: "BBVA",
                        },
                        {
                            value: "Claro",
                            label: "Claro",
                        },
                        {
                            value: "Claro_Digital",
                            label: "Claro Digital",
                        },
                        {
                            value: "Codensa",
                            label: "Codensa",
                        },
                        {
                            value: "Coomeva_Cartera",
                            label: "Coomeva Cartera",
                        },
                        {
                            value: "Coomeva_CEM",
                            label: "Coomeva CEM",
                        },
                        {
                            value: "Coomeva_MP",
                            label: "Coomeva MP",
                        },
                        {
                            value: "Credibanco",
                            label: "Credibanco",
                        },
                        {
                            value: "Dinerum",
                            label: "Dinerum",
                        },
                        {
                            value: "Falabella",
                            label: "Falabella",
                        },
                        {
                            value: "Falabella_Medellín",
                            label: "Falabella Medellín",
                        },
                        {
                            value: "Dinerum",
                            label: "Dinerum",
                        },
                        {
                            value: "Finandina",
                            label: "Finandina",
                        },
                        {
                            value: "Gerencia_Administrativa",
                            label: "Gerencia Administrativa",
                        },
                        {
                            value: "Gerencia_Legal_Riesgo",
                            label: "Gerencia de Legal y Riesgo",
                        },
                        {
                            value: "Gerencia_Mercadeo",
                            label: "Gerencia de Mercadeo",
                        },
                        {
                            value: "Gerencia_Operaciones",
                            label: "Gerencia de peraciones",
                        },
                        {
                            value: "Gerencia_Planeación",
                            label: "Gerencia de Planeación",
                        },
                        {
                            value: "Gerencia_Riesgo_Control_Interno",
                            label: "Gerencia de Riesgo y Control Interno",
                        },
                        {
                            value: "Gerencia_Tecnología",
                            label: "Gerencia de Tecnología",
                        },
                        {
                            value: "Gerencia_General",
                            label: "Gerencia General",
                        },
                        {
                            value: "Gerencia_Gestión_Humana",
                            label: "Gerencia Gestión Humana",
                        },
                        {
                            value: "Liberty",
                            label: "Liberty",
                        },
                        {
                            value: "MetLife",
                            label: "MetLife",
                        },
                        {
                            value: "Nueva_EPS",
                            label: "Nueva EPS",
                        },
                        {
                            value: "Pay_U",
                            label: "Pay-U",
                        },
                        {
                            value: "Presidencial",
                            label: "Presidencial",
                        },
                        {
                            value: "Recursos_Físicos ",
                            label: "Recursos Físicos ",
                        },
                        {
                            value: "Scotiabank_Colpatria",
                            label: "Scotiabank Colpatria",
                        },
                        {
                            value: "Sura",
                            label: "Sura",
                        },
                        {
                            value: "Yanbal_Bogotá",
                            label: "Yanbal Bogotá",
                        },
                        {
                            value: "Yanbal_Bucaramanga",
                            label: "Yanbal Bucaramanga",
                        },
                        {
                            value: "Yanbal_Ibague",
                            label: "Yanbal Ibague",
                        },
                        {
                            value: "Yanbal_Medellín",
                            label: "Yanbal Medellín",
                        },
                        {
                            value: "Yanbal_Villavicencio",
                            label: "Yanbal Villavicencio",
                        },
                    ],
                },
                {
                    id: "area_negocio",
                    label: "Area de negocio",
                    name: "area_negocio",
                    type: "select",
                    options: [
                        { value: "Dirección", label: "Dirección" },
                        { value: "Negocio", label: "Negocio" },
                    ],
                },
                {
                    id: "tipo_contrato",
                    label: "Tipo de contrato",
                    name: "tipo_contrato",
                    type: "select",
                    options: [
                        {
                            value: "Contrato a término indefinido",
                            label: "Contrato a término indefinido",
                        },
                        {
                            value: "Contrato a término fijo",
                            label: "Contrato a término fijo",
                        },
                        {
                            value: "Obra o Labor",
                            label: "Obra o Labor",
                        },
                        {
                            value: "Prestación de Servicio",
                            label: "Prestación de Servicio",
                        },
                        {
                            value: "Contrato de aprendizaje",
                            label: "Contrato de aprendizaje",
                        },
                    ],
                },
                {
                    id: "salario_2023",
                    label: "Salario 2023",
                    name: "salario_2023",
                    type: "number",
                },
                {
                    id: "subsidio_transporte_2023",
                    label: "Subsidio de transporte 2023",
                    name: "subsidio_transporte_2023",
                    type: "number",
                },
                {
                    id: "fecha_cambio_campana_periodo_prueba",
                    label: "Fecha de cambio de campaña y periodo de prueba",
                    name: "fecha_cambio_campana_periodo_prueba",
                    type: "date",
                    shrink: true,
                },
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
                    type: "text",
                },
                {
                    id: "42",
                    label: "Desempeño Segundo Semestre 2016",
                    name: "desempeno_2_sem_2016",
                    type: "text",
                },
                {
                    id: "44",
                    label: "Desempeño 2017",
                    name: "desempeno_2017",
                    type: "Number",
                },
                {
                    id: "45",
                    label: "Desempeño 2018",
                    name: "desempeno_2018",
                    type: "Number",
                },
                {
                    id: "46",
                    label: "Desempeño 2019",
                    name: "desempeno_2019",
                    type: "Number",
                },
                {
                    id: "47",
                    label: "Desempeño 2020",
                    name: "desempeno_2020",
                    type: "Number",
                },
                {
                    id: "48",
                    label: "Desempeño 2021",
                    name: "desempeno_2021",
                    type: "Number",
                },
            ],
        },
        // Inputs Pagina Acciones Disciplinarias
        {
            title: "Acciones Disciplinarias",
            inputs: [
                {
                    id: "49",
                    label: "Llamado de atencion",
                    name: "llamado_atencion",
                    type: "text",
                },
                {
                    id: "50",
                    label: "Memorando 1",
                    name: "memorando_1",
                    type: "text",
                },
                {
                    id: "51",
                    label: "Memorando 2",
                    name: "memorando_2",
                    type: "text",
                },
                {
                    id: "52",
                    label: "Memorando 3",
                    name: "memorando_3",
                    type: "text",
                },
            ],
        },
        // Inputs Pagina Información vacaciones
        {
            title: "Información de Vacaciones",
            inputs: [
                {
                    id: "53",
                    label: "Licencia no remunerada",
                    name: "licencia_no_remunerada",
                    type: "text",
                },
                {
                    id: "54",
                    label: "Periodos tomados de vacaciones",
                    name: "periodo_tomado_vacaciones",
                    type: "number",
                },
                {
                    id: "55",
                    label: "Periodos faltantes de vacaciones",
                    name: "periodos_faltantes_vacaciones",
                    type: "number",
                },
                {
                    id: "56",
                    label: "Fecha de salida de vacaciones",
                    name: "fecha_salida_vacaciones",
                    type: "date",
                    shrink: true,
                },
                {
                    id: "57",
                    label: "Fecha de ingreso de vacaciones",
                    name: "fecha_ingreso_vacaciones",
                    type: "date",
                    shrink: true,
                },
            ],
        },
        // Inputs Pagina Información Retiro
        {
            title: "Información de Retiro",
            inputs: [
                {
                    id: "58",
                    label: "Fecha de retiro",
                    name: "fecha_retiro",
                    type: "date",
                    shrink: true,
                },
                {
                    id: "59",
                    label: "Tipo de retiro",
                    name: "tipo_de_retiro",
                    type: "select",
                    options: [
                        { value: "Voluntario", label: "Voluntario" },
                        { value: "Involuntario", label: "Involuntario" },
                    ],
                },
                {
                    id: "60",
                    label: "Motivo del retiro",
                    name: "motivo_de_retiro",
                    type: "select",
                    options: [
                        { value: "Baja remuneración", label: "Baja remuneración" },
                        { value: "Calamidad familiar", label: "Calamidad familiar" },
                        { value: "Cambio de actividad", label: "Cambio de actividad" },
                        { value: "Conflictos en relaciones laborales", label: "Conflictos en relaciones laborales" },
                        { value: "Desplazamiento", label: "Desplazamiento" },
                        { value: "Estrés laboral", label: "Estrés laboral" },
                        { value: "Falta de herramientas para  desempeñar la labor", label: "Falta de herramientas para  desempeñar la labor" },
                        { value: "Falta de inducción al ingresar", label: "Falta de inducción al ingresar" },
                        { value: "Falta de reconocimiento", label: "Falta de reconocimiento" },
                        { value: "Horario laboral", label: "Horario laboral" },
                        { value: "Incompatibilidad con el jefe", label: "Incompatibilidad con el jefe" },
                        { value: "Mal ambiente laboral", label: "Mal ambiente laboral" },
                        { value: "Motivos de estudio", label: "Motivos de estudio" },
                        { value: "Motivos de salud", label: "Motivos de salud" },
                        { value: "Motivos de viaje", label: "Motivos de viaje" },
                        { value: "Motivos personales", label: "Motivos personales" },
                        { value: "No hay oportunidades de crecimiento laboral", label: "No hay oportunidades de crecimiento laboral" },
                        { value: "No hay oportunidades de estudiar", label: "No hay oportunidades de estudiar" },
                        { value: "Otro", label: "Otro" },
                        { value: "Problemas personales", label: "Problemas personales" },
                        { value: "Terminación de contrato aprendizaje", label: "Terminación de contrato aprendizaje" },
                        { value: "Terminación de contrato con justa causa", label: "Terminación de contrato con justa causa" },
                        { value: "Terminación de contrato por periodo de prueba", label: "Terminación de contrato por periodo de prueba" },
                        { value: "Terminación de contrato sin justa causa", label: "Terminación de contrato sin justa causa" },
                        { value: "Terminación por abandono de puesto", label: "Terminación por abandono de puesto" },
                        { value: "Terminación por obra o labor contratada ", label: "Terminación por obra o labor contratada " },
                    ],
                },
                {
                    id: "61",
                    label: "Estado",
                    name: "estado",
                    type: "select",
                    options: [
                        { value: "1", label: "Activo" },
                        { value: "0", label: "Inactivo" },
                    ],
                },
            ],
        },
    ];

    pageInputs.forEach((page) => {
        page.inputs.forEach((input) => {
            if (input.name in detalles) {
                input.value = detalles[input.name];
            }
        });
    });
    useEffect(() => {
        const initialInputValues = {};
        pageInputs.forEach((section) => {
            section.inputs.forEach((input) => {
                initialInputValues[input.name] = input.value;
            });
        });
        setInputValues(initialInputValues);

        // Calculate the age and the seniority
        const birthDate = pageInputs.flatMap((inputGroup) => inputGroup.inputs).find((input) => input.id === "3")?.value;
        setDataCalculateAge(calculateAge(birthDate));
        const affiliationDate = pageInputs.flatMap((inputGroup) => inputGroup.inputs).find((input) => input.id === "fecha_afiliacion")?.value;
        setSeniority(calculateSeniority(affiliationDate));
    }, [openModal]);

    // Search and table functionality
    useEffect(() => {
        const newRows = tableData.map(([cedula, nombre, correo, cargo, gerencia, campana, estado]) => ({
            cedula,
            nombre,
            correo,
            cargo,
            gerencia,
            campana,
            estado: estado === 1 ? true : false,
        }));
        setRows(newRows);
    }, [tableData]);

    useEffect(() => {
        setTableResults(
            rows.filter((person) => {
                for (const key in person) {
                    if (person[key].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                        return true;
                    }
                }
                return false;
            })
        );
    }, [searchTerm, rows]);

    // Disable functionality
    const handleSwitch = (row) => {
        const updatedTableResults = tableResults.map((item) => {
            if (item.cedula === row.cedula) {
                return { ...item, estado: !item.estado };
            } else {
                return item;
            }
        });
        const updatedRows = rows.map((item) => {
            if (item.cedula === row.cedula) {
                return { ...item, estado: !item.estado };
            } else {
                return item;
            }
        });
        const dataP = {
            cedula: row.cedula,
            change_to: !row.estado,
        };
        const changeState = async () => {
            try {
                const response = await fetch("https://staffnetback.cyc-bpo.com//change_state", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataP),
                });
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const data = await response.json();
                if (data.status === "success") {
                    setTableResults(updatedTableResults);
                    console.log(tableResults);
                    setRows(updatedRows);
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
            }
        };
        changeState();
    };

    // Edit functionality
    const submitEdit = (event) => {
        setProgressBar(true);
        event.preventDefault();
        const updateTransaction = async () => {
            try {
                const response = await fetch("https://staffnetback.cyc-bpo.com//update_transaction", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inputValues),
                });
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const data = await response.json();
                setProgressBar(false);
                if (data.status === "success") {
                    setTableResults([]);
                    setSearchTerm("");
                    searchEmployeesEdit();
                    handleCloseModal();
                    setShowSnackAlert("success", "Edición realizada correctamente");
                }
                if (data.error === "No hubo ningun cambio") {
                    setShowSnackAlert("info", "No se ha realizo ningun cambio");
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
            }
        };
        updateTransaction();
    };
    const searchEmployeesEdit = async () => {
        try {
            const response = await fetch("https://staffnetback.cyc-bpo.com//search_employees", {
                method: "POST",
                credentials: "include",
            });
            if (!response.ok) {
                throw Error(response.statusText);
            }
            const data = await response.json();
            if (data.info.status === "success") {
                setTableData(data.info.data);
            }
        } catch (error) {
            setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
        }
    };
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Add functionality
    const submitAdd = (event) => {
        event.preventDefault();
        setProgressBar(true);
        const insertTransaction = async (formData) => {
            try {
                const response = await fetch("https://staffnetback.cyc-bpo.com//insert_transaction", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                setProgressBar(false);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (data.status === "success") {
                    handleCloseModalAdd();
                    setShowSnackAlert("success", "Empleado añadido correctamente");
                } else {
                    setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + data.error, true);
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
            }
        };
        insertTransaction(formData);
    };
    const stylesModal = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "82%",
        height: "80%",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: "20px",
        overflow: "auto",
    };

    const handleChange = useCallback(
        (event, input) => {
            setInputValues({
                ...inputValues,
                [input.name]: event.target.value,
            });
        },
        [inputValues]
    );

    const handleChangeFile = (event) => {
        setFile(event.target.files[0]);

        const formData = new FormData();
        formData.append("file", file);

        const fetchEmployees = async () => {
            try {
                const response = await fetch("https://staffnetback.cyc-bpo.com//file", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify(formData),
                });
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const data = await response.json();
                console.log("enviado");
            } catch (error) {
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
                if (error === "Usuario no ha iniciado sesion") {
                    navigate("/");
                }
            }
        };
        fetchEmployees();
    };


    if (access) {
        return (
            <>
                <Fade in={progressBar}>
                    <Box sx={{ width: "100%", position: "absolute" }}>
                        <LinearProgress open={true} />
                    </Box>
                </Fade>
                <Fade in={transition}>
                    <Container>
                        <SnackAlert severity={severityAlert} message={messageAlert} open={openSnackAlert} close={handleCloseSnack}></SnackAlert>
                        {/* Edit Modal */}
                        <Modal
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            sx={{ display: "flex", borderRadius: "30px" }}
                        >
                            <Fade in={openModal}>
                                <Box sx={stylesModal} component="form" onSubmit={submitEdit}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mx: "10px",
                                        }}
                                    >
                                        {permissions.edit == 1 ? (
                                            <Tooltip title="Editar">
                                                <IconButton color="primary" onClick={() => handleEdit()}>
                                                    <EditIcon></EditIcon>
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <IconButton disabled>
                                                <EditIcon></EditIcon>
                                            </IconButton>
                                        )}
                                        <Box sx={{ display: "flex", gap: "15px" }}>
                                            <Button disabled={edit} type="submit">
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        paddingRight: ".5em",
                                                    }}
                                                >
                                                    <SaveIcon />
                                                </Box>
                                                Guardar
                                            </Button>

                                            <Tooltip title="Cancelar">
                                                <IconButton onClick={handleCloseModal}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                    <List
                                        sx={{
                                            overflow: "auto",
                                            maxHeight: "515px",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                            id="modal-modal-title"
                                            variant="h5"
                                            component="h3"
                                        >
                                            Detalles del empleado
                                        </Typography>
                                        <Box sx={{ p: 2 }}>
                                            {pageInputs.map((section) => (
                                                <Box
                                                    key={section.title}
                                                    sx={{
                                                        mb: 2,
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        width: "100%",
                                                        gap: "30px",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            width: "100%",
                                                        }}
                                                        variant="h6"
                                                        component="h3"
                                                    >
                                                        {section.title}
                                                    </Typography>
                                                    {section.inputs.map((input) => {
                                                        const getInputComponent = () => {
                                                            if (input.id === "antiguedad") {
                                                                return (
                                                                    <TextField
                                                                        disabled
                                                                        required
                                                                        key={input.id}
                                                                        name={input.name}
                                                                        label={input.label}
                                                                        type={input.type}
                                                                        sx={{
                                                                            width: "144px",
                                                                        }}
                                                                        value={seniority}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    />
                                                                );
                                                            }
                                                            if (input.id === "5") {
                                                                return (
                                                                    <TextField
                                                                        disabled
                                                                        required
                                                                        key={input.id}
                                                                        name={input.name}
                                                                        label={input.label}
                                                                        type={input.type}
                                                                        sx={{
                                                                            width: "144px",
                                                                        }}
                                                                        value={dataCalculateAge}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    />
                                                                );
                                                            }
                                                            if (input.id === 1) {
                                                                return (
                                                                    <TextField
                                                                        disabled
                                                                        required
                                                                        key={input.id}
                                                                        name={input.name}
                                                                        label={input.label}
                                                                        type={input.type}
                                                                        sx={{
                                                                            width: "144px",
                                                                        }}
                                                                        value={
                                                                            inputValues[input.name] !== undefined && inputValues[input.name] !== ""
                                                                                ? inputValues[input.name]
                                                                                : ""
                                                                        }
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    />
                                                                );
                                                            }
                                                            if (input.id === 61 && permissions.disable === 0) {
                                                                return (
                                                                    <TextField
                                                                        disabled
                                                                        required
                                                                        key={input.id}
                                                                        name={input.name}
                                                                        label={input.label}
                                                                        type={input.type}
                                                                        sx={{
                                                                            width: "144px",
                                                                        }}
                                                                        value={
                                                                            inputValues[input.name] !== undefined && inputValues[input.name] !== ""
                                                                                ? inputValues[input.name]
                                                                                : ""
                                                                        }
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    />
                                                                );
                                                            }
                                                            if (input.type === "select") {
                                                                return (
                                                                    <TextField
                                                                        select
                                                                        disabled={edit}
                                                                        key={input.id}
                                                                        sx={{
                                                                            width: "144px",
                                                                        }}
                                                                        required
                                                                        name={input.name}
                                                                        autoComplete="off"
                                                                        variant="outlined"
                                                                        label={input.label}
                                                                        onChange={(event) => handleChange(event, input)}
                                                                        value={
                                                                            inputValues[input.name] !== undefined && inputValues[input.name] !== ""
                                                                                ? inputValues[input.name]
                                                                                : ""
                                                                        }
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    >
                                                                        {input.options.map((option) => (
                                                                            <MenuItem key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                );
                                                            }
                                                            return (
                                                                <TextField
                                                                    disabled={edit}
                                                                    required
                                                                    key={input.id}
                                                                    sx={{
                                                                        width: "144px",
                                                                    }}
                                                                    type={input.type}
                                                                    name={input.name}
                                                                    autoComplete="off"
                                                                    label={input.label}
                                                                    value={
                                                                        inputValues[input.name] !== undefined && inputValues[input.name] !== ""
                                                                            ? inputValues[input.name]
                                                                            : ""
                                                                    }
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    onChange={(event) => handleChange(event, input)}
                                                                />
                                                            );
                                                        };
                                                        return getInputComponent();
                                                    })}
                                                </Box>
                                            ))}
                                        </Box>
                                    </List>
                                </Box>
                            </Fade>
                        </Modal>
                        {/* Add modal */}
                        <Modal
                            open={openModalAdd}
                            onClose={handleCloseModalAdd}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            sx={{ display: "flex", borderRadius: "30px" }}
                        >
                            <Fade in={openModalAdd}>
                                <Box sx={stylesModal} component="form" onSubmit={submitAdd}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mx: "10px",
                                        }}
                                    >
                                        <Button type="submit">
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    paddingRight: ".5em",
                                                }}
                                            >
                                                <SaveIcon />
                                            </Box>
                                            Guardar
                                        </Button>

                                        <Tooltip title="Cancelar">
                                            <IconButton onClick={handleCloseModalAdd}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <List
                                        sx={{
                                            overflow: "auto",
                                            maxHeight: "505px",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                            id="modal-modal-title"
                                            variant="h5"
                                            component="h3"
                                        >
                                            Añadir empleado
                                        </Typography>
                                        <Box sx={{ p: 2 }}>
                                            {pageInputs.map((section) => {
                                                function renderSelectInput(input, formData, handleFormChange) {
                                                    return (
                                                        <TextField
                                                            select
                                                            required
                                                            sx={{
                                                                width: "144px",
                                                            }}
                                                            key={input.id}
                                                            name={input.name}
                                                            onChange={handleFormChange}
                                                            value={formData[input.name] || ""}
                                                            variant="outlined"
                                                            autoComplete="off"
                                                            label={input.label}
                                                        >
                                                            {input.options.map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    );
                                                }

                                                function renderTextInput(input, formData, handleFormChange) {
                                                    return (
                                                        <TextField
                                                            required
                                                            sx={{
                                                                width: "144px",
                                                            }}
                                                            key={input.id}
                                                            name={input.name}
                                                            value={formData[input.name] || ""}
                                                            InputLabelProps={{
                                                                shrink: input.shrink,
                                                            }}
                                                            onChange={handleFormChange}
                                                            autoComplete="off"
                                                            type={input.type}
                                                            label={input.label}
                                                        />
                                                    );
                                                }

                                                function renderInput(input, formData, handleFormChange) {
                                                    if (input.type === "select") {
                                                        return renderSelectInput(input, formData, handleFormChange);
                                                    } else if (["5", "antiguedad"].includes(input.id)) {
                                                        return null;
                                                    } else {
                                                        return renderTextInput(input, formData, handleFormChange);
                                                    }
                                                }

                                                function renderInputs(section, formData, handleFormChange) {
                                                    return section.inputs.map((input) => renderInput(input, formData, handleFormChange));
                                                }

                                                return (
                                                    <Box
                                                        key={section.title}
                                                        sx={{
                                                            m: 2,
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            width: "100%",
                                                            gap: "30px",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                width: "100%",
                                                            }}
                                                            variant="h6"
                                                            component="h3"
                                                        >
                                                            {section.title}
                                                        </Typography>
                                                        {renderInputs(section, formData, handleFormChange)}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </List>
                                </Box>
                            </Fade>
                        </Modal>
                        <Header></Header>
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
                                    style={{ textAlign: "center" }}
                                    InputLabelProps={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    autoFocus
                                    fullWidth
                                    autoComplete="off"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    variant="standard"
                                ></TextField>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            {permissions.create == 1 ? (
                                <Button
                                    onClick={() => {
                                        handleOpenModalAdd();
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            paddingRight: ".5em",
                                        }}
                                    >
                                        <PersonAddIcon />
                                    </Box>
                                    Añadir
                                </Button>
                            ) : (
                                <Button disabled>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            paddingRight: ".5em",
                                        }}
                                    >
                                        <PersonAddIcon />
                                    </Box>
                                    Añadir
                                </Button>
                            )}
                            <Button component="label" startIcon={<UploadIcon />}>
                                Subir BD
                                <input type="file" hidden accept=".csv" onChange={handleChangeFile} />
                            </Button>
                        </Box>
                        <Box sx={{ padding: "15px 0px" }}>
                            <DataGrid
                                slots={{ toolbar: GridToolbar }}
                                columns={columns}
                                getRowId={(row) => row.cedula}
                                rows={tableResults}
                                checkboxSelection
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 4,
                                        },
                                    },
                                }}
                                pageSizeOptions={[4]}
                            />
                        </Box>
                    </Container>
                </Fade>
            </>
        );
    }
};

export default HomeView;
