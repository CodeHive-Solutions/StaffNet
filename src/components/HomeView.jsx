import React from "react";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState, useCallback } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Fade from "@mui/material/Fade";
import Header from "./Header";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import TableEmployees from "./TableEmployees";
import EmployeeHistory from "./EmployeeHistory";
import Switch from "@mui/material/Switch";
import { arrayData } from "../assets/arrayData";
import AddModal from "./AddModal";

const HomeView = () => {
    const [formData, setFormData] = useState({});
    const [detalles, setDetalles] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [rows, setRows] = useState([]);
    const [tableData, setTableData] = useState([]);
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
    const [checked, setChecked] = useState(true);
    const [originalData, setOriginalData] = useState(rows);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("https://staffnet-api-dev.cyc-bpo.com//search_employees", {
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
            if (antiguedadEnAños === 0 && antiguedadEnMesesRestantes === 1) {
                return `${antiguedadEnMesesRestantes} mes `;
            } else if (antiguedadEnAños === 0) {
                return `${antiguedadEnMesesRestantes} meses`;
            } else if (antiguedadEnAños === 1 && antiguedadEnMesesRestantes === 0) {
                return `${antiguedadEnAños} año`;
            } else if (antiguedadEnAños > 1 && antiguedadEnMesesRestantes === 0) {
                return `${antiguedadEnAños} años`;
            } else if (antiguedadEnAños === 1 && antiguedadEnMesesRestantes !== 1) {
                return `${antiguedadEnAños} año y ${antiguedadEnMesesRestantes} meses`;
            } else if (antiguedadEnMesesRestantes === 1) {
                return `${antiguedadEnAños} años y ${antiguedadEnMesesRestantes} mes`;
            } else {
                return `${antiguedadEnAños} años y ${antiguedadEnMesesRestantes} meses`;
            }
        }
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
    const handleOpenModal = (identificador) => {
        setCedulaDetails(identificador);
        setProgressBar(true);

        const getJoinInfo = async () => {
            try {
                const response = await fetch("https://staffnet-api-dev.cyc-bpo.com//get_join_info", {
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

    // Edit functionality
    const submitEdit = (event) => {
        setProgressBar(true);
        event.preventDefault();
        const updateTransaction = async () => {
            try {
                const response = await fetch("https://staffnet-api-dev.cyc-bpo.com//update_transaction", {
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
                    searchEmployeesUpdate();
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

    const searchEmployeesUpdate = async () => {
        try {
            const response = await fetch("https://staffnet-api-dev.cyc-bpo.com//search_employees", {
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
                        <SnackAlert
                            severity={severityAlert}
                            message={messageAlert}
                            open={openSnackAlert}
                            close={handleCloseSnack}
                            setShowSnackAlert={setShowSnackAlert}
                        ></SnackAlert>
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
                                            {arrayData.map((section) => (
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
                                                            if (input.id === "observaciones") {
                                                                return (
                                                                    <TextField
                                                                        disabled={edit}
                                                                        key={input.id}
                                                                        name={input.name}
                                                                        label={input.label}
                                                                        type={input.type}
                                                                        multiline
                                                                        rows={4}
                                                                        sx={{
                                                                            width: "100%",
                                                                        }}
                                                                        value={
                                                                            inputValues[input.name] !== undefined &&
                                                                            inputValues[input.name] !== null &&
                                                                            inputValues[input.name] !== ""
                                                                                ? inputValues[input.name]
                                                                                : ""
                                                                        }
                                                                        onChange={(event) => handleChange(event, input)}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    />
                                                                );
                                                            } else if (input.id === "antiguedad") {
                                                                return (
                                                                    <TextField
                                                                        disabled
                                                                        key={input.id}
                                                                        name={input.name}
                                                                        label={input.label}
                                                                        type={input.type}
                                                                        sx={{
                                                                            width: "20rem",
                                                                        }}
                                                                        value={seniority || ""}
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
                                                                        key={input.id}
                                                                        name={input.name}
                                                                        label={input.label}
                                                                        type={input.type}
                                                                        sx={{
                                                                            width: "20rem",
                                                                        }}
                                                                        value={dataCalculateAge}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    />
                                                                );
                                                            }
                                                            if (
                                                                input.id === "1" ||
                                                                input.id === "fecha_nombramiento_legado" ||
                                                                input.id === "cambio_campaña_legado" ||
                                                                input.id === "cambio_eps_legado"
                                                            ) {
                                                                return (
                                                                    <TextField
                                                                        disabled
                                                                        key={input.id}
                                                                        name={input.name}
                                                                        label={input.label}
                                                                        type={input.type}
                                                                        sx={{
                                                                            width: "20rem",
                                                                        }}
                                                                        value={
                                                                            inputValues[input.name] !== undefined &&
                                                                            inputValues[input.name] !== null &&
                                                                            inputValues[input.name] !== ""
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
                                                                        key={input.id}
                                                                        name={input.name}
                                                                        label={input.label}
                                                                        type={input.type}
                                                                        sx={{
                                                                            width: "20rem",
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
                                                                const optionExists = input.options.some((option) => option.value === inputValues[input.name]);

                                                                if (!optionExists) {
                                                                    input.options.push({
                                                                        value: inputValues[input.name],
                                                                        label: inputValues[input.name],
                                                                    });
                                                                }

                                                                return (
                                                                    <TextField
                                                                        select
                                                                        disabled={edit}
                                                                        key={input.id}
                                                                        sx={{
                                                                            width: "20rem",
                                                                        }}
                                                                        name={input.name}
                                                                        autoComplete="off"
                                                                        variant="outlined"
                                                                        label={input.label}
                                                                        onChange={(event) => handleChange(event, input)}
                                                                        value={
                                                                            inputValues[input.name] !== undefined &&
                                                                            inputValues[input.name] !== null &&
                                                                            inputValues[input.name] !== ""
                                                                                ? inputValues[input.name]
                                                                                : ""
                                                                        }
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    >
                                                                        {input.options.map((option, index) => (
                                                                            <MenuItem key={index} value={option.value}>
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                );
                                                            }
                                                            return (
                                                                <TextField
                                                                    disabled={edit}
                                                                    key={input.id}
                                                                    sx={{
                                                                        width: "20rem",
                                                                    }}
                                                                    type={input.type}
                                                                    name={input.name}
                                                                    autoComplete="off"
                                                                    label={input.label}
                                                                    value={
                                                                        inputValues[input.name] !== undefined &&
                                                                        inputValues[input.name] !== null &&
                                                                        inputValues[input.name] !== ""
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
                                tableData={tableData}
                                arrayData={arrayData}
                                rows={rows}
                                setOriginalData={setOriginalData}
                                setRows={setRows}
                                handleOpenModal={handleOpenModal}
                                setShowSnackAlert={setShowSnackAlert}
                                setProgressBar={setProgressBar}
                                checked={checked}
                            />
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography sx={{ fontSize: "25px", color: "#d3d3d3", fontStyle: "italic", fontWeight: "semi-bold" }}>We will win</Typography>
                        </Box>
                    </Container>
                </Fade>
            </>
        );
    }
};

export default HomeView;
