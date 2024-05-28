import React from "react";
import { useEffect, useState, useCallback } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Fade from "@mui/material/Fade";
import Header from "./Header";
import Typography from "@mui/material/Typography";
import SnackAlert from "./SnackAlert";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import TableEmployees from "./TableEmployees";
import Switch from "@mui/material/Switch";
import { arrayData } from "../assets/arrayData";
import AddModal from "./AddModal";
import { getApiUrl } from "../assets/getApi.js";
import EditModal from "./EditModal";
import WindowsUserDialog from "./WindowsUserDialog.jsx";
import MaternityDialog from "./MaternityDialog.jsx";

const HomeView = () => {
    const [formData, setFormData] = useState({});
    const [tableData, setTableData] = useState([]);
    const [detalles, setDetalles] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [rows, setRows] = useState([]);
    const [edit, setEdit] = useState(true);
    const [access, setAccess] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [transition, setTransition] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [messageAlert, setMessageAlert] = useState(false);
    const [openSnackAlert, setOpenSnackAlert] = useState(false);
    const [progressBar, setProgressBar] = useState(false);
    const [permissions, setPermissions] = useState("");
    const [dataCalculateAge, setDataCalculateAge] = useState();
    const [seniority, setSeniority] = useState("");
    const [severityAlert, setSeverityAlert] = useState("info");
    const [cedulaDetails, setCedulaDetails] = useState(0);
    const [cedulaWindows, setCedulaWindows] = useState(0);
    const [checked, setChecked] = useState(true);
    const [originalData, setOriginalData] = useState(rows);
    const [profilePicture, setProfilePicture] = useState();
    const [openWindowsUserDialog, setOpenWindowsUserDialog] = useState(false);
    const [openMaternityDialog, setOpenMaternityDialog] = useState(false);
    const [windowsUser, setWindowsUser] = useState("");
    const [casoMedicoEspecial, setCasoMedicoEspecial] = useState("");
    const [fechaInicioEmbarazo, setFechaInicioEmbarazo] = useState("");
    const [fechaFinEmbarazo, setFechaFinEmbarazo] = useState("");
    const [licenciaMaternidad, setLicenciaMaternidad] = useState("");
    const [fechaInicioLicencia, setFechaInicioLicencia] = useState("");
    const [fechaFinLicencia, setFechaFinLicencia] = useState("");

    const handleOpenDialog = (usuario_windows, cedula) => {
        setWindowsUser(usuario_windows);
        setCedulaWindows(cedula);
        setOpenWindowsUserDialog(true);
    };

    // format the dates like 'Fri, 04 Aug 2023 00:00:00 GMT' to a yyyy-mm-dd format
    const formatDate = (date) => {
        console.log(date);
        if (date) {
            console.log(date);
            const dateObject = new Date(date);
            console.log(dateObject);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, "0");
            const day = String(dateObject.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }
        return "";
    };

    const handleOpenMaternityDialog = (
        cedula,
        caso_medico_especial,
        fecha_inicio_embarazo,
        fecha_fin_embarazo,
        licencia_maternidad,
        fecha_inicio_licencia,
        fecha_fin_licencia
    ) => {
        let fechaInicioEmbarazo = formatDate(fecha_inicio_embarazo);
        setOpenMaternityDialog(true);
        setCedulaWindows(cedula);
        setCasoMedicoEspecial(caso_medico_especial);
        setFechaInicioEmbarazo(fechaInicioEmbarazo);
        setFechaFinEmbarazo(fecha_fin_embarazo);
        setLicenciaMaternidad(licencia_maternidad);
        setFechaInicioLicencia(fecha_inicio_licencia);
        setFechaFinLicencia(fecha_fin_licencia);
    };

    const handleCloseDialog = () => {
        setOpenWindowsUserDialog(false);
    };

    const handleCloseMaternityDialog = () => {
        setOpenMaternityDialog(false);
    };

    const calculateAge = (birthday) => {
        const birthDate = new Date(birthday);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
            return age - 1 + " AÑOS";
        } else {
            return age + " AÑOS";
        }
    };

    const calculateSeniority = (affiliationDate) => {
        if (affiliationDate === undefined) return;

        const fechaIngreso = new Date(affiliationDate);
        const fechaActual = new Date();
        const monthsDiff = (fechaActual.getFullYear() - fechaIngreso.getFullYear()) * 12 + (fechaActual.getMonth() - fechaIngreso.getMonth());

        const years = Math.floor(monthsDiff / 12);
        const months = monthsDiff % 12;

        const yearText = years === 1 ? "AÑO" : "AÑOS";
        const monthText = months === 1 ? "MES" : "MESES";

        const yearString = years > 0 ? `${years} ${yearText}` : "";
        const monthString = months > 0 ? `${months} ${monthText}` : "";

        return `${yearString}${yearString && monthString ? " Y " : ""}${monthString}`;
    };

    const handleOpenModalAdd = () => {
        setOpenModalAdd(true);
        setFormData({});
    };

    const handleCloseSnack = () => setOpenSnackAlert(false);
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

    const getProfilePicture = async (identificador) => {
        try {
            const response = await fetch(`${getApiUrl()}/profile-picture/${identificador}`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw 404;
                }
                throw new Error("Network response was not ok");
            }

            if (response.status === 200) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setProfilePicture(imageUrl);
            } else {
                setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + data.error, true);
            }
        } catch (error) {
            if (!error === 404) {
                setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + error, true);
            }
        }
    };

    const handleOpenModal = (identificador) => {
        setCedulaDetails(identificador);
        setProgressBar(true);
        // getProfilePicture(identificador);
        setProfilePicture(`${getApiUrl()}/profile-picture/${identificador}`);

        const getJoinInfo = async () => {
            try {
                const response = await fetch(`${getApiUrl()}/get_join_info`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cedula: identificador }),
                    contentEncoding: "br",
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
                    setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + data.error, true);
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + error, true);
            }
        };

        getJoinInfo();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEdit(true);
        setDetalles({});
    };

    arrayData.forEach((page) => {
        page.inputs.forEach((input) => {
            if (detalles && input.name in detalles) {
                input.value = detalles[input.name];
            }
        });
    });

    useEffect(() => {
        const initialInputValues = {};
        arrayData.forEach((section) => {
            section.inputs.forEach((input) => {
                initialInputValues[input.name] = input.value;
            });
        });

        setInputValues(initialInputValues);

        // Calculate the age and the seniority
        const birthDate = arrayData.flatMap((inputGroup) => inputGroup.inputs).find((input) => input.id === "3")?.value;
        setDataCalculateAge(calculateAge(birthDate));

        const affiliationDate = arrayData.flatMap((inputGroup) => inputGroup.inputs).find((input) => input.id === "fecha_ingreso")?.value;
        setSeniority(calculateSeniority(affiliationDate));
    }, [openModal]);

    const searchEmployeesUpdate = async () => {
        try {
            const response = await fetch(`${getApiUrl()}/search_employees`, {
                method: "POST",
                credentials: "include",
                contentEncoding: "br",
            });
            if (!response.ok) {
                throw Error(response.statusText);
            }
            const data = await response.json();
            if (data.info.status === "success") {
                addFields(data.info.data);
            }
        } catch (error) {
            setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + error, true);
        }
    };

    const addFields = (tableData) => {
        const newData = tableData.map((item) => {
            let age = item.fecha_nacimiento ? calculateAge(item.fecha_nacimiento) : undefined;
            let seniority = item.fecha_ingreso ? calculateSeniority(item.fecha_ingreso) : undefined;
            let completeName = item.apellidos && item.nombres ? item.apellidos + " " + item.nombres : item.nombres;

            // ignore the items nombres y apellidos
            delete item.nombres;
            delete item.apellidos;

            return {
                ...item,
                nombre_completo: completeName,
                ...(item.fecha_nacimiento && item.fecha_ingreso
                    ? { edad: age, antiguedad: seniority }
                    : item.fecha_nacimiento
                    ? { edad: age }
                    : item.fecha_ingreso
                    ? { antiguedad: seniority }
                    : {}),
            };
        });

        setTableData(newData);
    };

    const stylesModal = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "82%",
        height: "80%",
        bgcolor: "background.paper",
        p: 4,
        overflow: "auto",
        // borderRadius: "8px",
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

    const handleChangeCheck = (event) => {
        setChecked(event.target.checked);
        if (event.target.checked === true) {
            setRows(originalData.filter((record) => record.estado !== "RETIRADO"));
        } else {
            setRows(originalData);
        }
    };

    return (
        <>
            <Fade in={progressBar}>
                <Box sx={{ width: "100%", position: "absolute" }}>
                    <LinearProgress open={true} />
                </Box>
            </Fade>
            <Fade in={transition}>
                <Container>
                    <SnackAlert
                        severity={severityAlert}
                        message={messageAlert}
                        open={openSnackAlert}
                        close={handleCloseSnack}
                        setShowSnackAlert={setShowSnackAlert}
                    ></SnackAlert>
                    <EditModal
                        arrayData={arrayData}
                        openModal={openModal}
                        inputValues={inputValues}
                        handleEdit={handleEdit}
                        dataCalculateAge={dataCalculateAge}
                        seniority={seniority}
                        setOpenModal={setOpenModal}
                        setProgressBar={setProgressBar}
                        searchEmployeesUpdate={searchEmployeesUpdate}
                        stylesModal={stylesModal}
                        handleOpenModal={handleOpenModal}
                        setShowSnackAlert={setShowSnackAlert}
                        permissions={permissions}
                        edit={edit}
                        profilePicture={profilePicture}
                        setProfilePicture={setProfilePicture}
                        cedulaDetails={cedulaDetails}
                        handleChange={handleChange}
                        setDetalles={setDetalles}
                        setEdit={setEdit}
                        getProfilePicture={getProfilePicture}
                    />

                    <AddModal
                        arrayData={arrayData}
                        openModalAdd={openModalAdd}
                        formData={formData}
                        setFormData={setFormData}
                        setOpenModalAdd={setOpenModalAdd}
                        setProgressBar={setProgressBar}
                        searchEmployeesUpdate={searchEmployeesUpdate}
                        stylesModal={stylesModal}
                        handleOpenModalAdd={handleOpenModalAdd}
                        setShowSnackAlert={setShowSnackAlert}
                    />
                    <Header></Header>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <FormControlLabel
                            sx={{
                                color: "#1976d2",
                                fontSize: "5px", // Change this value to the desired font size
                            }}
                            control={<Switch sx={{ fontSize: "8px" }} onChange={handleChangeCheck} checked={checked} />}
                            label="SOLO ACTIVOS"
                        />
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
                    </Box>
                    <Box sx={{ padding: "15px 0px" }}>
                        <TableEmployees
                            arrayData={arrayData}
                            setPermissions={setPermissions}
                            setAccess={setAccess}
                            transition={transition}
                            setTransition={setTransition}
                            rows={rows}
                            setOriginalData={setOriginalData}
                            setRows={setRows}
                            handleOpenModal={handleOpenModal}
                            setShowSnackAlert={setShowSnackAlert}
                            setProgressBar={setProgressBar}
                            checked={checked}
                            tableData={tableData}
                            setTableData={setTableData}
                            handleOpenDialog={handleOpenDialog}
                            handleOpenMaternityDialog={handleOpenMaternityDialog}
                            searchEmployeesUpdate={searchEmployeesUpdate}
                        />
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontSize: "25px", color: "#d3d3d3", fontStyle: "italic", fontWeight: "semi-bold" }}>We will win</Typography>
                    </Box>
                </Container>
            </Fade>
            <WindowsUserDialog
                searchEmployeesUpdate={searchEmployeesUpdate}
                setShowSnackAlert={setShowSnackAlert}
                setOpenWindowsUserDialog={setOpenWindowsUserDialog}
                windowsUser={windowsUser}
                openWindowsUserDialog={openWindowsUserDialog}
                handleCloseDialog={handleCloseDialog}
                cedula={cedulaWindows}
            />
            <MaternityDialog
                searchEmployeesUpdate={searchEmployeesUpdate}
                setShowSnackAlert={setShowSnackAlert}
                openMaternityDialog={openMaternityDialog}
                handleCloseMaternityDialog={handleCloseMaternityDialog}
                cedula={cedulaWindows}
                casoMedicoEspecial={casoMedicoEspecial}
                fechaInicioEmbarazo={fechaInicioEmbarazo}
                fechaFinEmbarazo={fechaFinEmbarazo}
                licenciaMaternidad={licenciaMaternidad}
                fechaInicioLicencia={fechaInicioLicencia}
                fechaFinLicencia={fechaFinLicencia}
            />
        </>
    );
};

export default HomeView;
