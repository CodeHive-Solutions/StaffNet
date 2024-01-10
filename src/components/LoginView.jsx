// Import the material-ui components
import Cookies from "js-cookie";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Collapse from "@mui/material/Collapse";
import Snackbar from "@mui/material/Snackbar";
import CustomLogoST from "./LogoST";
import LoginIcon from "@mui/icons-material/Login";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import { getApiUrl } from "../assets/getApi.js";

// Import images
import image0 from "../images/ALE02947.webp";
import image1 from "../images/ALE02974.webp";
import image2 from "../images/ALE02976.webp";
import image3 from "../images/ALE03000.webp";
import image4 from "../images/ALE03010.webp";
import image5 from "../images/ALE03017.webp";
import image6 from "../images/ALE03025.webp";
import image7 from "../images/ALE03027.webp";
import image8 from "../images/ALE03043.webp";
import image9 from "../images/ALE03072.webp";
import image10 from "../images/ALE03167.webp";
import image11 from "../images/ALE03195.webp";
import image12 from "../images/ALE03213.webp";
import image13 from "../images/ALE03233.webp";
import image14 from "../images/ALE03281.webp";
import image15 from "../images/ALE03289.webp";
import image16 from "../images/ALE03298.webp";
import image17 from "../images/ALE03313.webp";
import image18 from "../images/ALE03324.webp";
import image19 from "../images/ALE03375.webp";

const LoginView = () => {
    // State variables for keeping track of the checkbox state, username, date, and collapse state
    const [rememberUsername, setRememberUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [open, setOpen] = useState(false);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [error, setError] = React.useState("");
    const [transition, setTransition] = React.useState(false);
    const [progressBar, setProgressBar] = React.useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const inputRef = useRef();
    const navigate = useNavigate();
    // Custom styles to the logo
    const customStyles = {
        letterSpacing: "9px",
        fontSize: "4em",
        borderTop: "solid .2rem",
        borderBottom: "solid .2rem",
        userSelect: "none",
    };

    const handleClickSnack = (error) => {
        setOpenSnack(true);
        setError(error);
    };

    const handleClose = () => {
        setOpenSnack(false);
    };

    useEffect(() => {
        const newIndex = Math.floor(Math.random() * images.length);
        setCurrentIndex(newIndex);
        const checkLogin = async () => {
            try {
                const response = await fetch(`${getApiUrl()}/logged`, {
                    method: "POST",
                    credentials: "include",
                    contentEncoding: "br",
                });
                // Check if the response was successful
                if (!response.ok) {
                    handleClickSnack(response.statusText);
                    throw Error(response.statusText);
                }
                const data = await response.json();
                if (data.status === "success") {
                    if (data.access === "permissions") {
                        navigate("/permissions", { replace: true });
                    } else {
                        navigate("/home", { replace: true });
                    }
                }
            } catch (error) {
                setProgressBar(false);
                handleClickSnack("Por favor envia este error a desarrollo: " + error.message);
                console.error("Error:", error.message);
            }
        };
        checkLogin();
    }, []);

    // Submit function that submits the form data to the server
    const handleSubmit = (event) => {
        // Prevent the default form submit behavior
        event.preventDefault();
        setProgressBar(true);
        if (rememberUsername) {
            // If the remember username checkbox is checked, save the username to local storage
            localStorage.setItem("username", username);
        } else {
            // If the remember username checkbox is not checked, remove the username from local storage
            localStorage.removeItem("username");
        }
        // Send a POST request to the server
        const dataP = {
            password: `${document.getElementById("clave").value}`,
            user: `${document.getElementById("usuario").value}`,
        };

        const login = async (dataP) => {
            try {
                const response = await fetch(`${getApiUrl()}/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataP),
                    contentEncoding: "br",
                });
                // Check if the response was successful
                if (!response.ok) {
                    handleClickSnack(response.statusText);
                    throw Error(response.statusText);
                }
                const data = await response.json();
                setProgressBar(false);
                if (data.status === "success") {
                    if (data.create_admins) {
                        navigate("/permissions", { replace: true });
                    } else {
                        navigate("/home", { replace: true });
                    }
                } else {
                    handleClickSnack(data.error);
                }
            } catch (error) {
                setProgressBar(false);
                handleClickSnack("Por favor envia este error a desarrollo: " + error.message);
                console.error("Error:", error.message);
            }
        };
        login(dataP);
    };
    useEffect(() => {
        setTransition(!transition);
        // Use effect hook to update the username from local storage if it exists
        if (localStorage.getItem("username") != null) {
            setUsername(localStorage.getItem("username"));
        }

        if (Cookies.get("token")) {
            let cookie = JSON.parse(Cookies.get("token"));
            if (cookie.accessTo === "permissions") {
                navigate("/permissions");
            } else {
                navigate("/home");
            }
        }
    }, []);

    const images = [
        image0,
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
        image8,
        image9,
        image10,
        image11,
        image12,
        image13,
        image14,
        image15,
        image16,
        image17,
        image18,
        image19,
    ];

    // Function to handle toggling the collapse state
    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            inputRef.current.focus();
        }, 0); // zero delay

        return () => {
            clearTimeout(timeoutId); // clear timeout on unmount
        };
    }, []);
    return (
        <Fade in={transition}>
            <Grid container component="main" sx={{ height: "100vh" }}>
                <Fade in={progressBar}>
                    <Box sx={{ width: "100%", position: "absolute" }}>
                        <LinearProgress open={true} />
                    </Box>
                </Fade>
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={openSnack}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    key={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
                        {error}
                    </Alert>
                </Snackbar>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${images[currentIndex]})`,
                        backgroundRepeat: "no-repeat",
                        backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <CustomLogoST styles={customStyles}></CustomLogoST>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="usuario"
                                label="Nombre de usuario"
                                name="usuario"
                                autoComplete="off"
                                spellCheck={false}
                                value={username}
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="clave"
                                label="Contraseña"
                                type="password"
                                id="clave"
                                inputRef={inputRef}
                                autoComplete="off"
                                aria-autocomplete="off"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                        checked={rememberUsername}
                                        onChange={(event) => setRememberUsername(event.target.checked)}
                                    />
                                }
                                label="Recuérdame"
                            />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                                    <LoginIcon></LoginIcon>
                                </Box>
                                Iniciar Sesion
                            </Button>
                            <Link href="#" onClick={handleClick}>
                                ¿Has olvidado tu contraseña?
                            </Link>
                            <Collapse in={open}>
                                <Alert severity="info">
                                    En caso de olvido o perdida de la contraseña contacte con tecnologia para el restablecimiento de la misma en:{" "}
                                    <a href="https://helpdesk.cyc-bpo.com/" target="_blank" rel="noreferrer noopener">
                                        GLPI
                                    </a>
                                </Alert>
                            </Collapse>
                            <Grid container>
                                <Grid item xs></Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Fade>
    );
};
export default LoginView;
