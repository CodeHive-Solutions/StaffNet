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
    const [checked, setChecked] = useState(true);
    const [originalData, setOriginalData] = useState(rows);
    const [profilePicture, setProfilePicture] = useState();

    const calculateAge = (birthdate) => {
        // Split birthday string into array of year, month, and day
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
        if (affiliationDate === undefined) return;

        const fechaIngreso = new Date(affiliationDate);
        const fechaActual = new Date();
        const monthsDiff = (fechaActual.getFullYear() - fechaIngreso.getFullYear()) * 12 + (fechaActual.getMonth() - fechaIngreso.getMonth());

        const years = Math.floor(monthsDiff / 12);
        const months = monthsDiff % 12;

        const yearText = years === 1 ? "año" : "años";
        const monthText = months === 1 ? "mes" : "meses";

        const yearString = years > 0 ? `${years} ${yearText}` : "";
        const monthString = months > 0 ? `${months} ${monthText}` : "";

        return `${yearString}${yearString && monthString ? " y " : ""}${monthString}`;
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
                setTableData(data.info.data);
            }
        } catch (error) {
            setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + error, true);
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
        borderRadius: "8px",
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
                        />
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontSize: "25px", color: "#d3d3d3", fontStyle: "italic", fontWeight: "semi-bold" }}>We will win</Typography>
                    </Box>
                </Container>
            </Fade>
        </>
    );
};

export default HomeView;
