import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import LogoST from "./LogoST";
import LogoutIcon from "@mui/icons-material/Logout";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MoreIcon from "@mui/icons-material/More";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function createData(cedula, nombre, celular, correo, estado) {
    return { cedula, nombre, celular, correo, estado };
}

const rows = [
    createData(
        1234567890,
        "Ejemplo Nombre Completo",
        1234567890,
        "ejemplocorreo@gmail.com",
        "Activo"
    ),
];

const handleInhabilitate = (cedula) => {
    // Do something with the cedula, like send it to the server to update the database
    console.log(`Inhabilitate register with cedula ${cedula}`);

    // Send a POST request to the server
    const data = { cedula };
    fetch("http://localhost:5000/App", {
        method: "POST",
        body: JSON.stringify(data),
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
            console.error("Error:", error);
        });
};

const BasicTable = () => {
    return (
        <TableContainer
            component={Paper}
            elevation={3}
            sx={{ marginTop: "30px" }}
        >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Cedula</TableCell>
                        <TableCell align="center">Nombre</TableCell>
                        <TableCell align="center">Celular</TableCell>
                        <TableCell align="center">Correo</TableCell>
                        <TableCell align="center">Estado</TableCell>
                        <TableCell align="center">Detalles</TableCell>
                        <TableCell align="center">Editar</TableCell>
                        <TableCell align="center">Inhabilitar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.cedula}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell align="center">{row.cedula}</TableCell>
                            <TableCell align="center">{row.nombre}</TableCell>
                            <TableCell align="center">{row.celular}</TableCell>
                            <TableCell align="center">{row.correo}</TableCell>
                            <TableCell align="center">{row.estado}</TableCell>
                            <TableCell align="center">
                                <Button title="Detalles">
                                    <MoreIcon></MoreIcon>
                                </Button>
                            </TableCell>
                            <TableCell align="center">
                                <Button title="Editar">
                                    <EditIcon></EditIcon>
                                </Button>
                            </TableCell>
                            <TableCell align="center">
                                <Button
                                    title="Inhabilitar"
                                    onClick={() =>
                                        handleInhabilitate(row.cedula)
                                    }
                                >
                                    <PersonOffIcon></PersonOffIcon>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const HomeView = ({ handleViewChange }) => {
    return (
        <Container>
            <Grid item xs={12}>
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
            </Grid>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "500px",
                    }}
                >
                    <TextField
                        label="Cedula de ciudadania del empleado"
                        fullWidth
                        variant="standard"
                        sx={{
                            display: "flex",
                            textAlign: "center",
                        }}
                    ></TextField>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => handleViewChange("SingUpView")}>
                    <Box sx={{ display: "flex", paddingRight: ".5em" }}>
                        <PersonAddIcon />
                    </Box>
                    Añadir
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    height: 600,
                }}
            >
                {BasicTable()}
            </Box>
        </Container>
    );
};

export default HomeView;
