import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";

const EmployeeHistory = ({ setShowSnackAlert, cedulaDetails }) => {
    const [employeeHistory, setEmployeeHistory] = useState([]);
    const [renderHistory, setRenderHistory] = useState(true);

    useEffect(() => {
        const getEmployeeHistory = async () => {
            try {
                const response = await fetch("https://staffnetback.cyc-bpo.com//employee_history", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cedula: cedulaDetails }),
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                console.log(data);
                if (data.status === "success") {
                    setEmployeeHistory(data.info);
                } else if (data.error === "Registro no encontrado") {
                    setRenderHistory(false);
                    setShowSnackAlert("info", "Este empleado no posee un historico actualmente", true);
                } else {
                    setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + data.error, true);
                }
            } catch (error) {
                console.error(error);
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
            }
        };
        getEmployeeHistory();
    }, []);

    if (renderHistory) {
        return (
            <Box sx={{ width: "100%", textAlign: "center" }}>
                <Typography variant="h6" component="h3">
                    Historial del empleado
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Campo</TableCell>
                                <TableCell>Valor pasado</TableCell>
                                <TableCell>Fecha del cambio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeeHistory.map((historyItem, index) => (
                                <TableRow key={index}>
                                    <TableCell>{historyItem}</TableCell>
                                    <TableCell>{historyItem}</TableCell>
                                    <TableCell>{historyItem}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    } else {
        return null;
    }
};

export default EmployeeHistory;
