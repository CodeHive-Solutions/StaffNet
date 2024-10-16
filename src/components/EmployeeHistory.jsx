import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getApiUrl } from "../assets/getApi.js";

const EmployeeHistory = ({ setShowSnackAlert, cedulaDetails }) => {
    const [employeeHistory, setEmployeeHistory] = useState([]);
    const [renderHistory, setRenderHistory] = useState(false);

    useEffect(() => {
        const getEmployeeHistory = async () => {
            try {
                const response = await fetch(`${getApiUrl()}/employee_history`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cedula: cedulaDetails }),
                    contentEncoding: "br",
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (data.status === "success") {
                    setRenderHistory(true);

                    const rows = data.info.map((row, index) => ({
                        id: index,
                        editedField: row[0],
                        previousValue: row[1],
                        newValue: row[2],
                        changeDate: row[3],
                    }));

                    setEmployeeHistory(rows);
                } else if (data.error != "Registro no encontrado") {
                    setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + data.error, true);
                }
            } catch (error) {
                console.error(error);
                setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + error, true);
            }
        };

        getEmployeeHistory();
    }, []);

    if (renderHistory) {
        return (
            <Box sx={{ width: "100%", textAlign: "center", mt: "35px" }}>
                <Typography variant="h6" component="h3">
                    Historial del empleado
                </Typography>
                <DataGrid
                    initialState={{
                        sorting: {
                            sortModel: [{ field: "changeDate", sort: "desc" }],
                        },
                    }}
                    rows={employeeHistory}
                    columns={[
                        { field: "editedField", headerName: "Campo Editado", width: 250 },
                        { field: "previousValue", headerName: "Valor Pasado", width: 250 },
                        { field: "newValue", headerName: "Valor Nuevo", width: 250 },
                        {
                            field: "changeDate",
                            headerName: "Fecha del Cambio",
                            width: 250,
                            valueFormatter: (params) => {
                                if (params.value === null) {
                                    return "";
                                } else {
                                    let date = new Date(params.value);
                                    let options = { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" };
                                    return date.toLocaleString("es-ES", options);
                                }
                            },
                        },
                    ]}
                    getRowId={(row) => row.id}
                />
            </Box>
        );
    } else {
        return (
            <Typography sx={{ textAlign: "center", color: "gray", mt: "30px" }} variant="h8" component="h6">
                Este empleado no posee un histórico actualmente
            </Typography>
        );
    }
};

export default EmployeeHistory;
