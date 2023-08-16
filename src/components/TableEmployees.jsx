import React from "react";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
    GridToolbarColumnsButton,
    GridToolbarQuickFilter,
    useGridApiContext,
} from "@mui/x-data-grid";
import { useEffect } from "react";
import cycLogo from "../images/cyc-logo.webp";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MoreIcon from "@mui/icons-material/More";
import { getApiUrl } from "../assets/getApi.js";

const TableEmployees = ({ arrayData, tableData, rows, setOriginalData, setRows, handleOpenModal, setShowSnackAlert, setProgressBar, checked }) => {
    function customDateComparator(dateString1, dateString2) {
        // Split the date strings into [day, month, year]
        let dateParts1 = dateString1.split("/");
        let dateParts2 = dateString2.split("/");

        // Create new Date objects in 'mm/dd/yyyy' format
        let date1 = new Date(`${dateParts1[1]}/${dateParts1[0]}/${dateParts1[2]}`);
        let date2 = new Date(`${dateParts2[1]}/${dateParts2[0]}/${dateParts2[2]}`);

        if (isNaN(date1) || isNaN(date2)) {
            console.error("Invalid date string:", dateString1, dateString2);
            return 0;
        }

        // compare the dates using the getTime method
        if (date1.getTime() < date2.getTime()) {
            return -1; // date1 is before date2
        } else if (date1.getTime() > date2.getTime()) {
            return 1; // date1 is after date2
        } else {
            return 0; // date1 is equal to date2
        }
    }

    const columns = arrayData.flatMap((page) => {
        return page.inputs
            .filter((input) => input.name !== "antiguedad" && input.name !== "edad" && input.name !== "desempeño")
            .map((input) => {
                if (input.name == "cedula") {
                    return {
                        field: input.name,
                        headerName: input.label,
                        width: 110,
                        valueFormatter: (params) => {
                            let value = params.value;
                            if (value === "" || value === null || value === undefined) {
                                return "-";
                            } else {
                                return value;
                            }
                        },
                    };
                }

                if (
                    input.name == "fecha_nacimiento" ||
                    input.name == "fecha_afiliacion_eps" ||
                    input.name == "fecha_ingreso" ||
                    input.name == "fecha_retiro" ||
                    input.name == "fecha_expedicion" ||
                    input.name == "fecha_nombramiento"
                ) {
                    return {
                        field: input.name,
                        headerName: input.label,
                        width: 100,
                        sortComparator: customDateComparator,
                    };
                }

                if (input.name == "salario" || input.name == "subsidio_transporte") {
                    return {
                        field: input.name,
                        headerName: input.label,
                        width: 105,
                        type: "number",
                        valueFormatter: (params) => {
                            let salary = params.value;
                            if (salary === null) {
                                return "-";
                            } else {
                                let options = { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 };
                                return salary.toLocaleString("es-CO", options);
                            }
                        },
                    };
                } else if (input.name == "nombre") {
                    return {
                        field: input.name,
                        headerName: input.label,
                        width: 270,
                        valueFormatter: (params) => {
                            let value = params.value;
                            if (value === "" || value === null || value === undefined) {
                                return "-";
                            } else {
                                return value;
                            }
                        },
                    };
                } else {
                    return {
                        field: input.name,
                        headerName: input.label,
                        width: 210,
                        valueFormatter: (params) => {
                            let value = params.value;
                            if (value === "" || value === null || value === undefined) {
                                return "-";
                            } else {
                                return value;
                            }
                        },
                    };
                }
            });
    });

    const hiddenColumns = columns.map((column) => column.field);

    const columnVisibilityModel = {
        ...hiddenColumns.reduce((acc, field) => ({ ...acc, [field]: false }), {}),
        cedula: true,
        nombre: true,
        campana: true,
        cargo: true,
        fecha_ingreso: true,
        salario: true,
        detalles: true,
        campana_general: true,
    };

    columns.push({
        field: "detalles",
        headerName: "Detalles",
        width: 65,
        renderCell: (params) => {
            const { row } = params;
            return (
                <Tooltip title="Detalles">
                    <IconButton color="primary" onClick={() => handleOpenModal(row.cedula)}>
                        <MoreIcon />
                    </IconButton>
                </Tooltip>
            );
        },
    });

    const initialState = React.useMemo(
        () => ({
            sorting: {
                sortModel: [{ field: "fecha_ingreso", sort: "desc" }],
            },
            filter: {
                filterModel: {
                    items: [],
                    quickFilterExcludeHiddenColumns: true,
                },
            },
            pagination: {
                paginationModel: {
                    pageSize: 12,
                },
            },
            columns: {
                columnVisibilityModel: columnVisibilityModel,
            },
        }),
        []
    );

    const CustomToolbar = (props) => {
        const apiRef = useGridApiContext();
        const handleExport = async () => {
            setShowSnackAlert("success", "El excel esta siendo procesado, por favor espera unos minutos");
            const csvOptions = { delimiter: ";", utf8WithBom: true };
            const result = apiRef.current.getDataAsCsv(csvOptions);
            try {
                const response = await fetch(`${getApiUrl()}/download`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "text/csv",
                    },
                    body: result,
                });
                setProgressBar(false);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const blob2 = await response.blob();
                // const data = await response.text();
                if (response.status === 200) {
                    // const blob = new Blob([data], { type: "text/csv;charset=utf-8" });
                    const url = window.URL.createObjectURL(blob2);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "exporte.xlsx");
                    document.body.appendChild(link);
                    link.click();
                } else {
                    console.error(response.status + response.statusText);
                    setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + response.statusText, true);
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
            }
        };

        return (
            <GridToolbarContainer {...props}>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <Button size="small" startIcon={<FileDownloadIcon />} onClick={() => handleExport()}>
                    Export
                </Button>
                <Box sx={{ textAlign: "end", flex: "1" }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };

    useEffect(() => {
        // Define a function to format the date
        function formatDate(dateString) {
            let date = new Date(dateString);
            return date.toLocaleDateString();
        }

        // Loop through the tableData and format the dates
        for (let i = 0; i < tableData.length; i++) {
            for (let j = 0; j < tableData[i].length; j++) {
                if (typeof tableData[i][j] === "string" && tableData[i][j].includes("GMT")) {
                    tableData[i][j] = formatDate(tableData[i][j]);
                }
            }
        }

        const deleteIndices = (array) => {
            return array.map((register) => register.filter((_, index) => ![22, 26, 30, 52].includes(index)));
        };

        const arrayCleaned = deleteIndices(tableData);

        const newRows = arrayCleaned.map((row) =>
            columns.reduce((newRow, column, index) => {
                if (index === row.length - 1) {
                    newRow[column.field] = row[index] ? "ACTIVO" : "RETIRADO";
                } else if (index === 47) {
                    newRow[column.field] = row[index] ? "Si" : "No";
                } else if (index === 52) {
                    if (index === false) {
                        newRow[column.field] = "No";
                    } else if (index === true) {
                        newRow[column.field] = "Si";
                    }
                } else {
                    newRow[column.field] = row[index];
                }
                return newRow;
            }, {})
        );

        setOriginalData(newRows);
        if (checked === true) {
            setRows(newRows.filter((record) => record.estado !== "RETIRADO"));
        } else {
            setRows(newRows);
        }
    }, [tableData]);

    const slots = { toolbar: CustomToolbar };

    return (
        <DataGrid
            GridColDef={"center"}
            sx={{
                position: "relative",
                height: "calc(100vh - 200px)",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundImage: `url(${cycLogo})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    borderRadius: "10px",
                    opacity: 0.15,
                    zIndex: -1,
                },
            }}
            slots={slots}
            columns={columns}
            getRowId={(row) => row.cedula}
            rows={rows}
            checkboxSelection
            initialState={initialState}
            pageSizeOptions={[12]}
            disableRowSelectionOnClick
        />
    );
};

export default TableEmployees;
