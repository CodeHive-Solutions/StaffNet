import React from "react";
import { useState, useRef } from "react";
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
import Cookies from "js-cookie";

const PermissionsView = ({ handleViewChange }) => {
    const userRef = useRef(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const permissions = ["Consultar", "Crear", "Editar", "Deshabilitar"];
    const [openSnack, setOpenSnack] = React.useState(false);
    const [error, setError] = React.useState("");
    const handleClickSnack = (error) => {
        setOpenSnack(true);
        setError(error);
    };

    const handleClose = (event, reason) => {
        setOpenSnack(false);
    };
    const validate = {
        request: "validate_edit",
    };
    const sesion = Cookies;
    console.log(sesion);

    fetch("http://localhost:5000", {
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const userValue = userRef.current.value;
        console.log("User:", userValue);
        console.log("Permissions:", selectedPermissions);
        // Send a POST request to the server
        const dataP = {
            request: "edit",
            user: userValue,
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
        <Container>
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
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "500px",
                    gap: "50px",
                }}
            >
                <TextField
                    sx={{
                        width: "550px",
                    }}
                    id="user"
                    label="Usuario de windows"
                    variant="standard"
                    inputRef={userRef}
                />
                <Box>
                    <Autocomplete
                        multiple
                        onChange={(event, value) =>
                            setSelectedPermissions(value)
                        }
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
                <Box>
                    <Button type="submit">
                        <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                            <SaveIcon />
                        </Box>
                        Guardar
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default PermissionsView;
