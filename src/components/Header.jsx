import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button"
import LogoST from "./LogoST"
import LogoutIcon from "@mui/icons-material/Logout";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { height } from "@mui/system";

const Header = (handleViewChange) => {
    handleViewChange = handleViewChange.handleViewChange

    const [openSnackSession, setOpenSnackSession] = React.useState(false);

    const handleCloseSession = () => {
        setOpenSnackSession(false);
    };

    const handleClickSnackSession = () => {
        setOpenSnackSession(true);
    };

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={openSnackSession}
                onClose={handleCloseSession}
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

            <Box
                sx={{
                    my: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 15,
                    width: "100%",
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
                        onClick={() => handleClickSnackSession()}
                    >
                        <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                            <LogoutIcon></LogoutIcon>
                        </Box>
                        Cerrar Sesion
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default Header