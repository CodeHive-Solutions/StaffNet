import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";


const PermissionsView = ({ handleViewChange }) => {

    const [openSnack, setOpenSnack] = React.useState(false);


    const handleClickSnack = () => {
        setOpenSnack(true);
    };

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };

};

return (
    <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackSession}
        onClose={handleCloseSession}
        key={{ vertical: "top", horizontal: "center" }}
    >
        <Alert
            severity="warning"
            onClose={handleCloseSession}
            sx={{ width: "100%" }}
        >
            ¿Esta seguro que desea cerrar sesion?
            <Box sx={{ display: "flex", justifyContent: "center", mt: "5px" }}>
                <Button color="inherit" onClick={() => handleViewChange("LoginView")}>
                    Confirmar
                </Button>
            </Box>
        </Alert>
    </Snackbar>


);

export default PermissionsView;
