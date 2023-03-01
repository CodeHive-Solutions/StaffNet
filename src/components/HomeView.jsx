import React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MoreIcon from "@mui/icons-material/More";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Fade from '@mui/material/Fade';
import Cookies from "js-cookie";
import Header from "./Header";
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

const HomeView = ({ handleViewChange }) => {

    const [transition, setTransition] = React.useState(false);
    const [tableData, setTableData] = React.useState([]);
    const [access, setAccess] = useState(false)
    const [employees, setEmployees] = useState(false)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const dataExample = [
        [1000, 'Julio Garabito', '1000000', 'ejemplo@gmail.com', 1],
        [1000065648, 'Ejemplo nombre', '10000002', 'ejemplo2@gmail.com', 0]
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = () => {
        console.log("hola")
    };

    const handleInhabilitate = () => {
        // Send a POST request to the server
        const dataP = {
            request: "change_state",
            cedula: 1000065648,
            token: Cookies.get('token'),
            change_to: document.getElementById('Switch').checked,
        };
        fetch("http://localhost:5000/App", {
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
                console.log(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        const validate = {
            request: "validate_consult",
            token: Cookies.get('token'),
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
                console.log(data);
                if (data.status !== "False") {
                    setAccess(true);
                } else {
                    handleViewChange("LoginView");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        setTransition(!transition)

        const consult = {
            request: "search_employees",
            token: Cookies.get('token'),
        };

        fetch("http://localhost:5000/App", {
            method: "POST",
            body: JSON.stringify(consult),
        })
            .then((response) => {
                // Check if the response was successful
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setTableData(data.data)
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    const createData = (cedula, nombre, celular, correo, estado) => {
        return { cedula, nombre, celular, correo, estado };
    }

    const columns = [
        { id: 'cedula', label: 'Cedula_ejemplo', minWidth: 170, align: 'center' },
        { id: 'nombre', label: 'Nombre', minWidth: 100, align: 'center' },
        { id: 'celular', label: 'Celular', minWidth: 100, align: 'center' },
        { id: 'correo', label: 'Correo', minWidth: 100, align: 'center' },
        { id: 'detalles', label: 'Detalles', minWidth: 100, align: 'center' },
        { id: 'editar', label: 'Editar', minWidth: 100, align: 'center' },
        { id: 'estado', label: 'Estado', minWidth: 100, align: 'center' },
    ];


    const rows = tableData.map(([cedula, nombre, celular, correo, estado]) => ({
        cedula,
        nombre,
        celular,
        correo,
        estado: estado === 1 ? true : false,
    }));

    console.log(rows);

    if (access) {
        return (
            <Fade in={transition}>
                <Container>
                    <Header handleViewChange={handleViewChange} logoRedirection={"HomeView"}></Header>
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
                                autoFocus
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

                        <Paper elevation={0} sx={{ width: '100%', }}>
                            <TableContainer sx={{ maxHeight: 550, width: "100%" }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.cedula}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {column.id === 'detalles'
                                                                        ? <Button title="Detalles">
                                                                            <MoreIcon></MoreIcon>
                                                                        </Button>
                                                                        : column.id === 'editar'
                                                                            ? <Button title="Editar">
                                                                                <EditIcon onClick={() => handleEdit()}></EditIcon>
                                                                            </Button> :
                                                                            column.id === 'estado' ?
                                                                                <Switch checked={row.estado}></Switch> :
                                                                                value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                sx={{ display: "flex", justifyContent: "center" }}
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Box>
                </Container>
            </Fade>
        );
    }
};

export default HomeView;
