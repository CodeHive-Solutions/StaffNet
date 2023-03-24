import React from "react";
import { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Collapse from '@mui/material/Collapse';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fade from '@mui/material/Fade';
import LinearProgress from '@mui/material/LinearProgress';
import Header from "./Header";
import Container from '@mui/material/Container';
import SnackAlert from "./SnackAlert";
import { useNavigate } from "react-router-dom";

const PermissionsView = () => {
    const navigate = useNavigate()
    const [access, setAccess] = useState(false);
    const [transition, setTransition] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [openSnackAlert, setOpenSnackAlert] = React.useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [open, setOpen] = useState(false);
    const [openSearch, setOpenSearch] = useState(true);
    const [error, setError] = React.useState("");
    const [progressBar, setProgressBar] = React.useState(false);
    const [create, setCreate] = React.useState(false);
    const userRef = useRef(null);
    const [messageAlert, setMessageAlert] = React.useState(false);
    const [severityAlert, setSeverityAlert] = React.useState("info");
    const permissions = ["Consultar", "Crear", "Editar", "Inhabilitar"];

    useEffect(() => {
        setTransition(!transition)

        const validateCreateAdmins = async () => {
            try {
                const response = await fetch("http://localhost:5000/validate_create_admins", {
                    method: "POST",
                    credentials: "include"
                });
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const data = await response.json();
                if (data.status === "success") {
                    setAccess(true);
                } else {
                    navigate("/")
                }
            }
            catch (error) {
                if (!access) {
                    navigate("/", { replace: true })
                }
                setShowSnackAlert("error", "Por fvor envia este error a desarrollo: " + error, true)
                console.error("Error:", error);
            }
        }
        validateCreateAdmins()
    }, []);

    const setShowSnackAlert = (severity, message, errorDev) => {
        setSeverityAlert(severity)
        setMessageAlert(message);
        setOpenSnackAlert(true);
        if (errorDev === true) {
            setProgressBar(false)
            console.error('error:', message);
        }
    }

    const handleClickSnack = (error) => {
        setOpenSnack(true);
        setError(error);
    };

    const handleCloseSnack = () => setOpenSnackAlert(false);

    const handleClickModal = () => {
        setOpenDialog(false);

        setTimeout(() => {
            setOpen(!open);
            setIsDisabled(!isDisabled)
            setOpenSearch(!openSearch)
        }, 250);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSubmitSearch = (event) => {
        event.preventDefault();
        setProgressBar(true)

        const userValueSearch = userRef.current.value;
        const dataSearch = {
            username: userValueSearch,
        };

        // Fetch search the windows user
        const searchAd = async (dataSearch) => {
            try {
                const response = await fetch("http://localhost:5000/search_ad", {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataSearch),
                });
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const data = await response.json();

                setProgressBar(false)
                if (data.status === "success" && data.info === undefined) {
                    setOpenDialog(true);
                    setCreate(true);
                }
                if (data.status === "success" && data.info !== undefined) {
                    const newPermissions = []
                    if (data.info[0] == 1) {
                        newPermissions.push("Consultar");
                    }
                    if (data.info[1] == 1) {
                        newPermissions.push("Crear");
                    }
                    if (data.info[2] == 1) {
                        newPermissions.push("Editar");
                    }
                    if (data.info[3] == 1) {
                        newPermissions.push("Inhabilitar");
                    }
                    setSelectedPermissions([...selectedPermissions, ...newPermissions]);
                    setOpen(!open);
                    setIsDisabled(!isDisabled)
                    setOpenSearch(!openSearch)
                }

                if (data.status === "false") {
                    setOpenSnack(true);
                    setError(data.error);
                }

            }
            catch (error) {
                setProgressBar(false)
                setShowSnackAlert("error", "Por fvor envia este error a desarrollo: " + error, true)
                console.error("Error:", error.message);
            }
        }
        searchAd(dataSearch)
    }

    const handleClose = (event, reason) => {
        setOpenSnack(false);
    };

    const handleClear = () => {
        setOpen(!open);
        setIsDisabled(!isDisabled)
        setOpenSearch(!openSearch)
        setSelectedPermissions([]);
        setCreate(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userValueSubmit = userRef.current.value;

        const permissionsObject = {
            consultar: selectedPermissions.includes('Consultar'),
            crear: selectedPermissions.includes('Crear'),
            editar: selectedPermissions.includes('Editar'),
            inhabilitar: selectedPermissions.includes('Inhabilitar'),
        };

        if (create === true) {
            const dataCreate = {
                user: userValueSubmit,
                permissions: permissionsObject,
            };
            const createData = async () => {
                try {
                    const response = await fetch("http://localhost:5000/create", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(dataCreate),
                    });
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    const data = await response.json();

                    if (data.status === "success") {
                        setShowSnackAlert("success", "Creacion realizada correctamente")
                        handleClear();
                    } else {
                        handleClickSnack("Hubo un error: " + data.error);
                    }
                } catch (error) {
                    setShowSnackAlert("error", "Por fvor envia este error a desarrollo: " + error, true)
                    console.error("Error:", error);
                }
            };
            createData()

        } else {
            // Send a POST request to the server
            const dataEdit = {
                user: userValueSubmit,
                permissions: permissionsObject,
            };
            const editAdmin = async () => {
                try {
                    const response = await fetch("http://localhost:5000/edit_admin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(dataEdit),
                    });
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    const data = await response.json();
                    if (data.status === "success") {
                        setShowSnackAlert("success", "Edición realizada correctamente")
                    } else if (data.status === "false" && data.error === "No hubo ningun cambio.") {
                        setShowSnackAlert("info", "No hubo ningun cambio")
                    } else if (data.status === "False" && data.error === "No puedes cambiar tus permisos.") {
                        setShowSnackAlert("info", "No puedes cambiar tus permisos.")
                    }
                    handleClear();
                } catch (error) {
                    setShowSnackAlert("error", "Por fvor envia este error a desarrollo: " + error, true)
                    console.error("Error:", error);
                }
            };
            editAdmin()
        }
    };

    if (access === true) {
        return (
            <>
                <Fade in={progressBar}>
                    <Box sx={{ width: '100%', position: "absolute" }}>
                        <LinearProgress open={true} />
                    </Box>
                </Fade>

                <Fade in={transition}>
                    <Container>

                        <SnackAlert severity={severityAlert} message={messageAlert} open={openSnackAlert} close={handleCloseSnack}></SnackAlert>

                        <Dialog
                            open={openDialog}
                            onClose={handleCloseDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle sx={{ textAlign: "center" }} id="alert-dialog-title">
                                {"¿Desea crear este usuario en el sistema?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText sx={{ textAlign: "center" }} id="alert-dialog-description">
                                    El usuario consultado no se encuentra registrado en nuestro sistema. ¿Desea crearlo?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button color={"error"} onClick={handleCloseDialog}>Descartar</Button>
                                <Button onClick={handleClickModal} autoFocus={true}>
                                    Continuar
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Snackbar
                            anchorOrigin={{ vertical: "top", horizontal: "center" }}
                            open={openSnack}
                            autoHideDuration={6000}
                            onClose={handleClose}
                        >
                            <Alert
                                onClose={handleClose}
                                severity="error"
                                sx={{ width: "100%" }}
                            >
                                {error}
                            </Alert>
                        </Snackbar>

                        <Header></Header>

                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", height: "75vh" }}>
                            <Box component="form"
                                onSubmit={handleSubmitSearch}
                                sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
                            >

                                <TextField
                                    autoFocus
                                    sx={{
                                        width: "550px",
                                    }}
                                    id="user"
                                    label="Usuario de windows"
                                    variant="standard"
                                    inputRef={userRef}
                                    disabled={isDisabled}
                                    autoComplete="off"
                                />

                                <Box>
                                    <Collapse in={openSearch}>
                                        <Button type="submit">
                                            <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                                                <PersonSearchIcon />
                                            </Box>
                                            Buscar
                                        </Button>
                                    </Collapse>
                                </Box>
                            </Box>


                            <Collapse in={open}>
                                <Box
                                    component="form"
                                    onSubmit={handleSubmit}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "15px",
                                        heigh: "100%"
                                    }}
                                >

                                    <Box>
                                        <Autocomplete
                                            multiple
                                            onChange={(event, value) => {
                                                setSelectedPermissions(value)
                                            }
                                            }
                                            value={selectedPermissions}
                                            id="multiple-limit-tags"
                                            options={permissions}
                                            getOptionLabel={(permissions) => permissions}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Permisos"
                                                    placeholder="Permisos"
                                                />
                                            )}
                                            sx={{ width: "570px" }}
                                        />
                                    </Box>

                                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                                        <Box>
                                            <Button type="button" color="error" onClick={handleClear}>
                                                <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                                                    <CancelIcon />
                                                </Box>
                                                Cancelar
                                            </Button>
                                        </Box>

                                        <Box>
                                            <Button type="submit">
                                                <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                                                    <SaveIcon />
                                                </Box>
                                                Guardar
                                            </Button>
                                        </Box>

                                    </Box>

                                </Box>

                            </Collapse>
                        </Box>

                    </Container>

                </Fade>
            </>
        );
    }
};

export default PermissionsView;
