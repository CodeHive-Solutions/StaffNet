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
import EmployeeHistory from "./EmployeeHistory";

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
    const [seniority, setSeniority] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [severityAlert, setSeverityAlert] = React.useState("info");
    const [file, setFile] = useState(null);
    const [gender, setGender] = useState("");
    const [cedulaDetails, setCedulaDetails] = React.useState(0);
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
        return age + " años";
    };

    const calculateSeniority = (affiliationDate) => {
        if (affiliationDate !== undefined) {
            const fechaIngreso = new Date(affiliationDate);
            const fechaActual = new Date();
            const antiguedadEnMeses = (fechaActual.getFullYear() - fechaIngreso.getFullYear()) * 12 + (fechaActual.getMonth() - fechaIngreso.getMonth());
            const antiguedadEnAños = Math.floor(antiguedadEnMeses / 12);
            const antiguedadEnMesesRestantes = antiguedadEnMeses % 12;
            return antiguedadEnAños + " años y " + antiguedadEnMesesRestantes + " meses";
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
    const handleOpenModal = (identificador) => {
        setCedulaDetails(identificador);
        setProgressBar(true);

        const getJoinInfo = async () => {
            try {
                const response = await fetch("https://staffnetback.cyc-bpo.com//get_join_info", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cedula: identificador }),
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (data.status === "success") {
                    console.log(data.data);
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
        { field: "cargo", headerName: "Cargo", width: 240 },
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

        // {
        //     field: "estado",
        //     headerName: "Estado",
        //     width: 80,
        //     renderCell: (params) => {
        //         const { row } = params;
        //         if (permissions.disable == 1) {
        //             return (
        //                 <Tooltip title={row.estado ? "Inhabilitar" : "Habilitar"}>
        //                     <Switch checked={row.estado} onChange={() => handleSwitch(row)} />
        //                 </Tooltip>
        //             );
        //         } else {
        //             return <Switch disabled checked={row.estado} />;
        //         }
        //     },
        // },
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
                    label: "Fecha de expedición",
                    name: "fecha_expedicion",
                    type: "date",
                    shrink: true,
                },
                {
                    id: "2",
                    label: "Nombre Completo",
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
                        { value: "FEMENINO", label: "Femenino" },
                        { value: "MASCULINO", label: "Masculino" },
                    ],
                },
                { id: "5", label: "Edad", name: "edad", type: "text" },
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
                        { value: "CASADO(A)", label: "Casado(a)" },
                        { value: "DIVORCIADO(A)", label: "Divorciado(a)" },
                        { value: "SEPARADO(A)", label: "Separado(a)" },
                        { value: "SOLTERO(A)", label: "Soltero(a)" },
                        { value: "UNION LIBRE(A)", label: "Union Libre" },
                        { value: "VIUDO(A)", label: "Viudo(a)" },
                    ],
                },
                {
                    id: "9",
                    label: "Hijos",
                    name: "hijos",
                    type: "select",
                    options: [
                        { value: "0", label: "0" },
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
                        { value: "0", label: "0" },
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
                        { value: "", label: "Seleccione una opción" },
                        { value: "ABUELO(A)", label: "Abuelo(a)" },
                        { value: "AMIGO(A)", label: "Amigo(a)" },
                        { value: "ESPOSO(A)", label: "Esposo(a)" },
                        { value: "FAMILIAR(A)", label: "Familiar" },
                        { value: "HERMANO(A)", label: "Hermano(a)" },
                        { value: "HIJO(A)", label: "Hijo(a)" },
                        { value: "MADRE(A)", label: "Madre(a)" },
                        { value: "PADRE(A)", label: "Padre(a)" },
                        { value: "PAREJA(A)", label: "Pareja(a)" },
                        { value: "PRIMO(A)", label: "Primo(a)" },
                        { value: "TIO(A)", label: "Tio(a)" },
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
                        { value: "PRIMARIA", label: "Primaria" },
                        { value: "BACHILLER", label: "Bachiller" },
                        { value: "TÉCNICO", label: "Técnico" },
                        { value: "TECNÓLOGO", label: "Tecnólogo" },
                        { value: "AUXILIAR", label: "Auxiliar" },
                        { value: "UNIVERSITARIO(A)", label: "Universitario" },
                        { value: "PROFESIONAL", label: "Profesional" },
                        { value: "ESPECIALIZACIÓN", label: "Especialización" },
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
                        { value: "BOGOTA", label: "Bogotá D.C" },
                        { value: "BUCARAMANGA", label: "Bucaramanga" },
                        { value: "MEDELLIN", label: "Medellin" },
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
                    type: "text",
                    shrink: true,
                },
                {
                    id: "eps",
                    label: "EPS",
                    name: "eps",
                    type: "select",
                    options: [
                        { value: "ASMET SALUD", label: "ASMET SALUD" },
                        { value: "CAPITAL SALUD", label: "CAPITAL SALUD" },
                        { value: "COMPENSAR", label: "COMPENSAR" },
                        { value: "COOSALUD", label: "COOSALUD" },
                        { value: "FAMISANAR", label: "FAMISANAR" },
                        { value: "N/A", label: "N/A" },
                        { value: "NUEVA EPS", label: "NUEVA EPS" },
                        { value: "SALUD TOTAL", label: "SALUD TOTAL" },
                        { value: "SANITAS", label: "SANITAS" },
                        { value: "SURA EPS", label: "SURA EPS" },
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
                // {
                //     id: "cambio_eps_pension_fecha",
                //     label: "Cambio de eps y fecha de pension",
                //     name: "cambio_eps_pension_fecha",
                //     type: "date",
                //     shrink: true,
                // },
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
                        { value: "ANALISTA DE APLICACIONES DE CONTACT CENTER", label: "Analista de Aplicaciones de Contact Center" },
                        { value: "ANALISTA DE BD Y APLICACIONES", label: "Analista de BD y Aplicaciones" },
                        { value: "ANALISTA DE INVESTIGACIÓN", label: "Analista de Investigación" },
                        { value: "ANALISTA DE SANEAMIENTO", label: "Analista de Saneamiento" },
                        { value: "ANALISTA DE SOPORTE", label: "Analista de Soporte" },
                        { value: "ANALISTA GESTIÓN HUMANA", label: "Analista Gestión Humana" },
                        { value: "ANALISTA JURÍDICO", label: "Analista Jurídico" },
                        { value: "ASESOR(A) COMERCIAL", label: "Asesor(a) Comercial" },
                        { value: "ASESOR(A) DE NEGOCIACIÓN", label: "Asesor(a) de Negociación" },
                        { value: "ASESOR(A) DE NEGOCIACIÓN JR", label: "Asesor(a) de Negociación jr" },
                        { value: "ASESOR(A) SENIOR", label: "Asesor(a) Senior" },
                        { value: "AUXILIAR ADMINISTRATIVO", label: "Auxiliar Administrativo" },
                        { value: "AUXILIAR DE LICITACIÓN", label: "Auxiliar de Licitación" },
                        { value: "AUXILIAR DE RECURSOS FÍSICOS", label: "Auxiliar de Recursos Físicos" },
                        { value: "AUXILIAR OPERATIVO", label: "Auxiliar Operativo" },
                        { value: "BACK OFFICE", label: "Back Office" },
                        { value: "COORDINADOR CONTABLE", label: "Coordinador Contable" },
                        { value: "COORDINADOR DE CAPACITACIÓN", label: "Coordinador de Capacitación" },
                        { value: "COORDINADOR(A) BI", label: "Coordinador(a) BI" },
                        { value: "COORDINADOR(A) DE BACKOFFICE", label: "Coordinador(a) de BackOffice" },
                        { value: "COORDINADOR(A) DE INVESTIGACIONES", label: "Coordinador(a) de Investigaciones" },
                        { value: "COORDINADOR(A) DE PLANEACIÓN Y CALIDAD", label: "Coordinador(a) de Planeación y Calidad" },
                        { value: "COORDINADOR(A) DE PROYECTO", label: "Coordinador(a) de Proyecto" },
                        { value: "DATA MARSHALL", label: "Data Marshall" },
                        { value: "DIRECTOR(A) ANALITYCS", label: "Director(a) Analitycs" },
                        { value: "DIRECTOR(A) DE INVESTIGACIONES", label: "Director(a) de Investigaciones" },
                        { value: "DIRECTOR(A) DE PROYECTO", label: "Director(a) de Proyecto" },
                        { value: "DIRECTOR(A) DE RECURSOS FÍSICOS", label: "Director(a) de Recursos Físicos" },
                        { value: "DIRECTOR(A) DE SST", label: "Director(a) de SST" },
                        { value: "DIRECTOR(A) JURÍDICO", label: "Director(a) Jurídico" },
                        { value: "FORMADOR", label: "Formador" },
                        { value: "GERENTE ADMINISTRATIVA", label: "Gerente Administrativa" },
                        { value: "GERENTE DE CONTROL INTERNO", label: "Gerente de Control Interno" },
                        { value: "GERENTE DE CUENTAS", label: "Gerente de cuentas" },
                        { value: "GERENTE DE GESTIÓN HUMANA", label: "Gerente de Gestión Humana" },
                        { value: "GERENTE DE LEGAL Y DE RIESGO", label: "Gerente de Legal y de Riesgo" },
                        { value: "GERENTE DE MERCADEO", label: "Gerente de Mercadeo" },
                        { value: "GERENTE DE OPERACIONES", label: "Gerente de Operaciones" },
                        { value: "GERENTE DE PLANEACIÓN", label: "Gerente de Planeación" },
                        { value: "GERENTE DE TECNOLOGÍA", label: "Gerente de Tecnología" },
                        { value: "GERENTE GENERAL", label: "Gerente General" },
                        { value: "GERENTE JR INFRAESTRUCTURA Y REDES", label: "Gerente Jr Infraestructura y Redes" },
                        { value: "GERENTE JR. DE APLICACIONES DE CONTACT CENTER", label: "Gerente jr.de Aplicaciones de Contact Center" },
                        { value: "GERENTE JR. DE MESA DE SERVICIO", label: "Gerente jr.de Mesa de Servicio" },
                        { value: "OPERADOR LOGÍSTICO", label: "Operador Logístico" },
                        { value: "PRESIDENTE", label: "Presidente" },
                        { value: "SENA LECTIVA", label: "Sena Lectiva" },
                        { value: "SENA PRODUCTIVA", label: "Sena Productiva" },
                        { value: "SERVICIOS GENERALES", label: "Servicios Generales" },
                        { value: "SUPERNUMERARIO", label: "Supernumerario" },
                        { value: "SUPERVISOR(A) DE CALIDAD", label: "Supervisor(a) de Calidad" },
                        { value: "EN BLANCO", label: "En blanco" },
                    ],
                },
                {
                    id: "gerencia",
                    label: "Gerencia",
                    name: "gerencia",
                    type: "select",
                    options: [
                        {
                            value: "PLANEACIÓN",
                            label: "Planeación",
                        },
                        {
                            value: "ADMINISTRATIVA",
                            label: "Administrativa",
                        },
                        {
                            value: "LEGAL RIESGO",
                            label: "Legal y Riesgo",
                        },
                        {
                            value: "TECNOLOGÍA",
                            label: "Tecnología",
                        },
                        {
                            value: "GESTIÓN HUMANA",
                            label: "Gestión Humana",
                        },
                        {
                            value: "AZTECA",
                            label: "Azteca",
                        },
                        {
                            value: "BANCO AGRARIO",
                            label: "Banco Agrario",
                        },
                        {
                            value: "BBVA",
                            label: "BBVA",
                        },
                        {
                            value: "CLARO",
                            label: "Claro",
                        },
                        {
                            value: "CLARO DIGITAL",
                            label: "Claro Digital",
                        },
                        {
                            value: "CODENSA",
                            label: "Codensa",
                        },
                        {
                            value: "COOMEVA CARTERA",
                            label: "Coomeva Cartera",
                        },
                        {
                            value: "COOMEVA CEM",
                            label: "Coomeva CEM",
                        },
                        {
                            value: "COOMEVA MP",
                            label: "Coomeva MP",
                        },
                        {
                            value: "CREDIBANCO",
                            label: "Credibanco",
                        },
                        {
                            value: "DINERUM",
                            label: "Dinerum",
                        },
                        {
                            value: "FALABELLA",
                            label: "Falabella",
                        },
                        {
                            value: "FALABELLA MEDELLÍN",
                            label: "Falabella Medellín",
                        },
                        {
                            value: "DINERUM",
                            label: "Dinerum",
                        },
                        {
                            value: "FINANDINA",
                            label: "Finandina",
                        },
                        {
                            value: "GERENCIA ADMINISTRATIVA",
                            label: "Gerencia Administrativa",
                        },
                        {
                            value: "GERENCIA LEGAL RIESGO",
                            label: "Gerencia de Legal y Riesgo",
                        },
                        {
                            value: "GERENCIA MERCADEO",
                            label: "Gerencia de Mercadeo",
                        },
                        {
                            value: "GERENCIA OPERACIONES",
                            label: "Gerencia de peraciones",
                        },
                        {
                            value: "GERENCIA PLANEACIÓN",
                            label: "Gerencia de Planeación",
                        },
                        {
                            value: "GERENCIA RIESGO CONTROL INTERNO",
                            label: "Gerencia de Riesgo y Control Interno",
                        },
                        {
                            value: "GERENCIA TECNOLOGÍA",
                            label: "Gerencia de Tecnología",
                        },
                        {
                            value: "GERENCIA GENERAL",
                            label: "Gerencia General",
                        },
                        {
                            value: "GERENCIA GESTIÓN HUMANA",
                            label: "Gerencia Gestión Humana",
                        },
                        {
                            value: "LIBERTY",
                            label: "Liberty",
                        },
                        {
                            value: "METLIFE",
                            label: "MetLife",
                        },
                        {
                            value: "NUEVA EPS",
                            label: "Nueva EPS",
                        },
                        {
                            value: "PAY U",
                            label: "Pay-U",
                        },
                        {
                            value: "PRESIDENCIAL",
                            label: "Presidencial",
                        },
                        {
                            value: "RECURSOS FÍSICOS ",
                            label: "Recursos Físicos ",
                        },
                        {
                            value: "SCOTIABANK COLPATRIA",
                            label: "Scotiabank Colpatria",
                        },
                        {
                            value: "SURA",
                            label: "Sura",
                        },
                        {
                            value: "YANBAL BOGOTÁ",
                            label: "Yanbal Bogotá",
                        },
                        {
                            value: "YANBAL BUCARAMANGA",
                            label: "Yanbal Bucaramanga",
                        },
                        {
                            value: "YANBAL IBAGUE",
                            label: "Yanbal Ibague",
                        },
                        {
                            value: "YANBAL MEDELLÍN",
                            label: "Yanbal Medellín",
                        },
                        {
                            value: "YANBAL VILLAVICENCIO",
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
                            value: "PLANEACIÓN",
                            label: "Planeación",
                        },
                        {
                            value: "ADMINISTRATIVA",
                            label: "Administrativa",
                        },
                        {
                            value: "LEGAL RIESGO",
                            label: "Legal y Riesgo",
                        },
                        {
                            value: "TECNOLOGÍA",
                            label: "Tecnología",
                        },
                        {
                            value: "GESTIÓN HUMANA",
                            label: "Gestión Humana",
                        },
                        {
                            value: "AZTECA",
                            label: "Azteca",
                        },
                        {
                            value: "BANCO AGRARIO",
                            label: "Banco Agrario",
                        },
                        {
                            value: "BBVA",
                            label: "BBVA",
                        },
                        {
                            value: "CLARO",
                            label: "Claro",
                        },
                        {
                            value: "CLARO DIGITAL",
                            label: "Claro Digital",
                        },
                        {
                            value: "CODENSA",
                            label: "Codensa",
                        },
                        {
                            value: "COOMEVA CARTERA",
                            label: "Coomeva Cartera",
                        },
                        {
                            value: "COOMEVA CEM",
                            label: "Coomeva CEM",
                        },
                        {
                            value: "COOMEVA MP",
                            label: "Coomeva MP",
                        },
                        {
                            value: "CREDIBANCO",
                            label: "Credibanco",
                        },
                        {
                            value: "DINERUM",
                            label: "Dinerum",
                        },
                        {
                            value: "FALABELLA",
                            label: "Falabella",
                        },
                        {
                            value: "FALABELLA MEDELLÍN",
                            label: "Falabella Medellín",
                        },
                        {
                            value: "DINERUM",
                            label: "Dinerum",
                        },
                        {
                            value: "FINANDINA",
                            label: "Finandina",
                        },
                        {
                            value: "GERENCIA ADMINISTRATIVA",
                            label: "Gerencia Administrativa",
                        },
                        {
                            value: "GERENCIA LEGAL RIESGO",
                            label: "Gerencia de Legal y Riesgo",
                        },
                        {
                            value: "GERENCIA MERCADEO",
                            label: "Gerencia de Mercadeo",
                        },
                        {
                            value: "GERENCIA OPERACIONES",
                            label: "Gerencia de peraciones",
                        },
                        {
                            value: "GERENCIA PLANEACIÓN",
                            label: "Gerencia de Planeación",
                        },
                        {
                            value: "GERENCIA RIESGO CONTROL INTERNO",
                            label: "Gerencia de Riesgo y Control Interno",
                        },
                        {
                            value: "GERENCIA TECNOLOGÍA",
                            label: "Gerencia de Tecnología",
                        },
                        {
                            value: "GERENCIA GENERAL",
                            label: "Gerencia General",
                        },
                        {
                            value: "GERENCIA GESTIÓN HUMANA",
                            label: "Gerencia Gestión Humana",
                        },
                        {
                            value: "LIBERTY",
                            label: "Liberty",
                        },
                        {
                            value: "METLIFE",
                            label: "MetLife",
                        },
                        {
                            value: "NUEVA EPS",
                            label: "Nueva EPS",
                        },
                        {
                            value: "PAY U",
                            label: "Pay-U",
                        },
                        {
                            value: "PRESIDENCIAL",
                            label: "Presidencial",
                        },
                        {
                            value: "RECURSOS FÍSICOS ",
                            label: "Recursos Físicos ",
                        },
                        {
                            value: "SCOTIABANK COLPATRIA",
                            label: "Scotiabank Colpatria",
                        },
                        {
                            value: "SURA",
                            label: "Sura",
                        },
                        {
                            value: "YANBAL BOGOTÁ",
                            label: "Yanbal Bogotá",
                        },
                        {
                            value: "YANBAL BUCARAMANGA",
                            label: "Yanbal Bucaramanga",
                        },
                        {
                            value: "YANBAL IBAGUE",
                            label: "Yanbal Ibague",
                        },
                        {
                            value: "YANBAL MEDELLÍN",
                            label: "Yanbal Medellín",
                        },
                        {
                            value: "YANBAL VILLAVICENCIO",
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
                        { value: "DIRECCÍON", label: "Dirección" },
                        { value: "NEGOCIO", label: "Negocio" },
                    ],
                },
                {
                    id: "tipo_contrato",
                    label: "Tipo de contrato",
                    name: "tipo_contrato",
                    type: "select",
                    options: [
                        {
                            value: "CONTRATO A TÉRMINO INDEFINIDO",
                            label: "Contrato a término indefinido",
                        },
                        {
                            value: "CONTRATO A TÉRMINO FIJO",
                            label: "Contrato a término fijo",
                        },
                        {
                            value: "OBRA O LABOR",
                            label: "Obra o Labor",
                        },
                        {
                            value: "PRESTACIÓN DE SERVICIO",
                            label: "Prestación de Servicio",
                        },
                        {
                            value: "CONTRATO DE APRENDIZAJE",
                            label: "Contrato de aprendizaje",
                        },
                    ],
                },
                {
                    id: "salario",
                    label: "Salario",
                    name: "salario",
                    type: "number",
                },
                {
                    id: "subsidio_transporte",
                    label: "Subsidio de transporte 2023",
                    name: "subsidio_transporte",
                    type: "number",
                },
                // {
                //     id: "fecha_cambio_campana_periodo_prueba",
                //     label: "Fecha de cambio de campaña y periodo de prueba",
                //     name: "fecha_cambio_campana_periodo_prueba",
                //     type: "date",
                //     shrink: true,
                // },
                {
                    id: "desempeño",
                    label: "Desempeño",
                    name: "desempeño",
                    type: "text",
                    shrink: true,
                },
            ],
        },
        // Inputs Pagina Acciones Disciplinarias
        {
            title: "Acciones Disciplinarias",
            inputs: [
                {
                    id: "falta",
                    label: "Falta",
                    name: "falta",
                    type: "text",
                },
                {
                    id: "tipo_sancion",
                    label: "Tipo de Sanción",
                    name: "tipo_sancion",
                    type: "text",
                },
                {
                    id: "sancion",
                    label: "Sansión",
                    name: "sancion",
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
                        { value: "VOLUNTARIO", label: "Voluntario" },
                        { value: "INVOLUNTARIO", label: "Involuntario" },
                    ],
                },
                {
                    id: "60",
                    label: "Motivo del retiro",
                    name: "motivo_de_retiro",
                    type: "select",
                    options: [
                        { value: "BAJA REMUNERACIÓN", label: "Baja remuneración" },
                        { value: "CALAMIDAD FAMILIAR", label: "Calamidad familiar" },
                        { value: "CAMBIO DE ACTIVIDAD", label: "Cambio de actividad" },
                        { value: "CONFLICTOS EN RELACIONES LABORALES", label: "Conflictos en relaciones laborales" },
                        { value: "DESPLAZAMIENTO", label: "Desplazamiento" },
                        { value: "ESTRÉS LABORAL", label: "Estrés laboral" },
                        { value: "FALTA DE HERRAMIENTAS PARA  DESEMPEÑAR LA LABOR", label: "Falta de herramientas para  desempeñar la labor" },
                        { value: "FALTA DE INDUCCIÓN AL INGRESAR", label: "Falta de inducción al ingresar" },
                        { value: "FALTA DE RECONOCIMIENTO", label: "Falta de reconocimiento" },
                        { value: "HORARIO LABORAL", label: "Horario laboral" },
                        { value: "INCOMPATIBILIDAD CON EL JEFE", label: "Incompatibilidad con el jefe" },
                        { value: "MAL AMBIENTE LABORAL", label: "Mal ambiente laboral" },
                        { value: "MOTIVOS DE ESTUDIO", label: "Motivos de estudio" },
                        { value: "MOTIVOS DE SALUD", label: "Motivos de salud" },
                        { value: "MOTIVOS DE VIAJE", label: "Motivos de viaje" },
                        { value: "MOTIVOS PERSONALES", label: "Motivos personales" },
                        { value: "NO HAY OPORTUNIDADES DE CRECIMIENTO LABORAL", label: "No hay oportunidades de crecimiento laboral" },
                        { value: "NO HAY OPORTUNIDADES DE ESTUDIAR", label: "No hay oportunidades de estudiar" },
                        { value: "OTRO", label: "Otro" },
                        { value: "PROBLEMAS PERSONALES", label: "Problemas personales" },
                        { value: "TERMINACIÓN DE CONTRATO APRENDIZAJE", label: "Terminación de contrato aprendizaje" },
                        { value: "TERMINACIÓN DE CONTRATO CON JUSTA CAUSA", label: "Terminación de contrato con justa causa" },
                        { value: "TERMINACIÓN DE CONTRATO POR PERIODO DE PRUEBA", label: "Terminación de contrato por periodo de prueba" },
                        { value: "TERMINACIÓN DE CONTRATO SIN JUSTA CAUSA", label: "Terminación de contrato sin justa causa" },
                        { value: "TERMINACIÓN POR ABANDONO DE PUESTO", label: "Terminación por abandono de puesto" },
                        { value: "TERMINACIÓN POR OBRA O LABOR CONTRATADA ", label: "Terminación por obra o labor contratada " },
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
            if (detalles && input.name in detalles) {
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
        const newRows = tableData.map(([cedula, nombre, correo, cargo, gerencia, campana]) => ({
            cedula,
            nombre,
            correo,
            cargo,
            gerencia,
            campana,
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
            // let newObj = Object.assign(
            //     {
            //         falta: "",
            //         tipo_sancion: "",
            //         sancion: "",
            //         licencia_no_remunerada: "",
            //         periodo_tomado_vacaciones: "",
            //         periodos_faltantes_vacaciones: "",
            //         fecha_salida_vacaciones: "",
            //         fecha_ingreso_vacaciones: "",
            //         fecha_retiro: "2021-01-01",
            //         tipo_de_retiro: "",
            //         motivo_de_retiro: "",
            //         estado: "1",
            //     },
            //     formData
            // );

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
                    console.log(data.error + "error alert");
                    setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + data.error.toString(), true);
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

    // function to handle the database upload
    // const handleChangeFile = (event) => {
    //     setFile(event.target.files[0]);

    //     const formData = new FormData();
    //     formData.append("file", file);

    //     const fetchEmployees = async () => {
    //         try {
    //             const response = await fetch("https://staffnetback.cyc-bpo.com//file", {
    //                 method: "POST",
    //                 credentials: "include",
    //                 body: JSON.stringify(formData),
    //             });
    //             if (!response.ok) {
    //                 throw Error(response.statusText);
    //             }
    //             const data = await response.json();
    //         } catch (error) {
    //             setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
    //             if (error === "Usuario no ha iniciado sesion") {
    //                 navigate("/");
    //             }
    //         }
    //     };
    //     fetchEmployees();
    // };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
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
                                                <IconButton
                                                    onClick={handleCloseModal}
                                                    sx={{
                                                        "&:hover": {
                                                            color: "#d32f2f",
                                                        },
                                                    }}
                                                >
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
                                            <EmployeeHistory setShowSnackAlert={setShowSnackAlert} cedulaDetails={cedulaDetails} />
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
                                            <IconButton
                                                onClick={handleCloseModalAdd}
                                                sx={{
                                                    "&:hover": {
                                                        color: "#d32f2f",
                                                    },
                                                }}
                                            >
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
                                                    if (input.id === "59" || input.id === "60" || input.id === "61") {
                                                        return null;
                                                    } else if (input.name === "parentesco") {
                                                        return (
                                                            <TextField
                                                                select
                                                                sx={{
                                                                    width: "144px",
                                                                }}
                                                                key={input.id}
                                                                options={input.options}
                                                                name={input.name}
                                                                onChange={handleFormChange}
                                                                value={formData[input.name] || ""}
                                                                defaultValue={input.defaultValue}
                                                                variant="outlined"
                                                                autoComplete="off"
                                                                label={input.label}
                                                            ></TextField>
                                                        );
                                                    }
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
                                                            defaultValue={input.defaultValue}
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
                                                            sx={{
                                                                width: "144px",
                                                            }}
                                                            required
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
                                                        if (input.name === "gender") {
                                                            return (
                                                                <TextField select label="Gender" value={gender} onChange={handleGenderChange}>
                                                                    <MenuItem value="male">Male</MenuItem>
                                                                    <MenuItem value="female">Female</MenuItem>
                                                                </TextField>
                                                            );
                                                        } else {
                                                            return renderSelectInput(input, formData, handleFormChange);
                                                        }
                                                    } else if (
                                                        [
                                                            "5",
                                                            "antiguedad",
                                                            "desempeño",
                                                            "falta",
                                                            "tipo_sancion",
                                                            "sancion",
                                                            "53",
                                                            "54",
                                                            "55",
                                                            "56",
                                                            "57",
                                                            "58",
                                                            "59",
                                                            "60",
                                                            "61",
                                                        ].includes(input.id)
                                                    ) {
                                                        return null;
                                                    } else {
                                                        return renderTextInput(input, formData, handleFormChange);
                                                    }
                                                }

                                                function renderInputs(section, formData, handleFormChange) {
                                                    return section.inputs.map((input) => renderInput(input, formData, handleFormChange));
                                                }

                                                const excludedTitles = ["Acciones Disciplinarias", "Información de Vacaciones", "Información de Retiro"];
                                                if (excludedTitles.includes(section.title)) {
                                                    return null;
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
                            {/* <Button component="label" startIcon={<UploadIcon />}>
                                Subir BD
                                <input type="file" hidden accept=".csv" onChange={handleChangeFile} />
                            </Button> */}
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
                                            pageSize: 8,
                                        },
                                    },
                                }}
                                pageSizeOptions={[8]}
                            />
                        </Box>
                    </Container>
                </Fade>
            </>
        );
    }
};

export default HomeView;
