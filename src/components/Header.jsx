import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LogoST from "./LogoST";
import LogoutIcon from "@mui/icons-material/Logout";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [openSnackSession, setOpenSnackSession] = React.useState(false);

    const handleCloseSession = () => {
        setOpenSnackSession(false);
    };

    const closeSesion = () => {
        fetch("https://staffnetback.cyc-bpo.com//logout", {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                // Check if the response was successful
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") {
                    navigate("/", { replace: true });
                } else {
                    handleClickSnack("Por favor envia este error a desarrollo: " + data.error);
                }
            })
            .catch((error) => {
                handleClickSnack("Por favor envia este error a desarrollo: " + error.message);
                console.error("Error:", error);
            });
    };

    const handleClickSnackSession = () => {
        setOpenSnackSession(true);
    };

    return (
        <>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={openSnackSession} onClose={handleCloseSession}>
                <Alert severity="warning" onClose={handleCloseSession} sx={{ width: "100%" }}>
                    ¿Esta seguro que desea cerrar sesion?
                    <Box sx={{ display: "flex", justifyContent: "center", mt: "5px" }}>
                        <Button color="inherit" onClick={() => closeSesion()}>
                            Confirmar
                        </Button>
                    </Box>
                </Alert>
            </Snackbar>

            <Box
                sx={{
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        userSelect: "none",
                    }}
                >
                    <Link color="inherit" underline="none">
                        <LogoST></LogoST>
                    </Link>
                </Box>
                <Box>
                    <Button size="Large" color="error" onClick={() => handleClickSnackSession()}>
                        <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                            <LogoutIcon></LogoutIcon>
                        </Box>
                        Cerrar Sesion
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default Header;
