import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from "@mui/material";

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

                // Add an id property to each row
                const rows = data.map((row, index) => ({ ...row, id: index }));

                setEmployeeHistory(rows);
            } catch (error) {
                console.error(error);
                setShowSnackAlert(true);
            } finally {
                setRenderHistory(false);
            }
        };

        if (renderHistory) {
            getEmployeeHistory();
        }
    }, [renderHistory, cedulaDetails, setShowSnackAlert]);

    if (renderHistory) {
        return (
            <Box sx={{ width: "100%", textAlign: "center", mt: "35px" }}>
                <Typography variant="h6" component="h3">
                    Historial del empleado
                </Typography>
                <DataGrid
                    rows={employeeHistory}
                    columns={[
                        { field: "editedField", headerName: "Campo Editado", width: 200 },
                        { field: "previousValue", headerName: "Valor Pasado", width: 200 },
                        { field: "changeDate", headerName: "Fecha del Cambio", width: 200 },
                    ]}
                    getRowId={(row) => row.id}
                />
            </Box>
        );
    } else {
        return (
            <Typography sx={{ textAlign: "center", color: "gray", mt: "30px" }} variant="h8" component="h6">
                Este empleado no posee un historico actualmente
            </Typography>
        );
    }
};

export default EmployeeHistory;
