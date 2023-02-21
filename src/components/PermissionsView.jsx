import React from "react";
import { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SaveIcon from "@mui/icons-material/Save";
import LogoST from "./LogoST";
import LogoutIcon from "@mui/icons-material/Logout";
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

const PermissionsView = ({ handleViewChange }) => {
    const [transition, setTransition] = React.useState(false);

    useEffect(() => {
        setTransition(!transition)
        // Make fetch request to validate session
        const validate = {
            request: "validate_edit",

        };

        // Fetch validate the session
        fetch("http://localhost:5000/App", {
            method: "POST",
            body: JSON.stringify(validate),
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
                    "status:",
                    data.status,
                    "error",
                    data.error,

                );
            })
            .catch((error) => {
                handleClickSnack(
                    "Por favor envia este error a desarrollo: " + error.message
                );
                console.error("Error:", error);
            });
        console.log("Solo una vez")
    }, []);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [open, setOpen] = useState(false);
    const [openSearch, setOpenSearch] = useState(true);
    const [error, setError] = React.useState("");
    const userRef = useRef(null);
    const permissions = ["Consultar", "Crear", "Editar", "Deshabilitar"];

    const handleClickSnack = (error) => {
        setOpenSnack(true);
        setError(error);
    };

    const handleClickModal = () => {
        setOpenDialog(false);

        setTimeout(() => {
            setOpen(!open);
            setIsDisabled(!isDisabled)
            setOpenSearch(!openSearch)
        }, 230);
    };

    const handleClickDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSubmitSearch = (event) => {
        event.preventDefault();
        const userValueSearch = userRef.current.value;
        const dataSearch = {
            request: "search",
            username: userValueSearch
        };
        console.log(userValueSearch)
        // Fetch search the windows user
        fetch("http://localhost:5000/App", {
            method: "POST",
            body: JSON.stringify(dataSearch),
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
                    "status:",
                    data.status,
                    "error",
                    data.error,
                    "info: ", data.info
                );
                if (data.status === "success" && data.info === undefined) {
                    setOpenDialog(true);
                }
                if (
                    data.status === "success" && data.info !== undefined) {
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
                        newPermissions.push("Deshabilitar");
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

            })
            .catch((error) => {
                handleClickSnack(
                    "Por favor envia este error a desarrollo: " + error.message
                );
                console.error("Error:", error);
            });

    }

    const handleClose = (event, reason) => {
        setOpenSnack(false);
    };

    const handleClear = () => {
        setOpen(!open);
        setIsDisabled(!isDisabled)
        setOpenSearch(!openSearch)
        setSelectedPermissions([]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userValueSubmit = userRef.current.value;
        console.log("User:", userValueSubmit);
        console.log("Permissions:", selectedPermissions);
        // Send a POST request to the server
        const dataP = {
            request: "edit",
            user: userValueSubmit,
            permissions: selectedPermissions.join(" "),
        };
        fetch("http://localhost:5000", {
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
                handleClickSnack(
                    "Por favor envia este error a desarrollo: " + error.message
                );
                console.error("Error:", error);
            });
    };

    return (
        <Fade in={transition}>
            <Container>
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
                        <Button onClick={handleClickModal} autoFocus>
                            Continuar
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={openSnack}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    key={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleClose}
                        severity="error"
                        sx={{ width: "100%" }}
                    >
                        {error}
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
                        <LogoST></LogoST>
                    </Box>
                    <Box>
                        <Button
                            size="Large"
                            color="error"
                            onClick={() => handleViewChange("LoginView")}
                        >
                            <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                                <LogoutIcon></LogoutIcon>
                            </Box>
                            Cerrar Sesion
                        </Button>
                    </Box>
                </Box>

                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                }}>

                    <Box component="form"
                        onSubmit={handleSubmitSearch}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "15px"
                        }}>

                        <TextField
                            sx={{
                                width: "550px",
                            }}
                            id="user"
                            label="Usuario de windows"
                            variant="standard"
                            inputRef={userRef}
                            disabled={isDisabled}
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
                                height: "150px",
                                gap: "15px",
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
    );
};

export default PermissionsView;
