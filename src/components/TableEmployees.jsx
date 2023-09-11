import React, { useState, useEffect, useMemo } from "react";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
    GridToolbarColumnsButton,
    GridToolbarQuickFilter,
    useGridApiContext,
} from "@mui/x-data-grid";
import cycLogo from "../images/cyc-logo.webp";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MoreIcon from "@mui/icons-material/More";
import { getApiUrl } from "../assets/getApi.js";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useNavigate } from "react-router-dom";

const TableEmployees = ({
    arrayData,
    setTransition,
    transition,
    setPermissions,
    rows,
    setRows,
    setOriginalData,
    handleOpenModal,
    setShowSnackAlert,
    setProgressBar,
    checked,
}) => {
    const [tableData, setTableData] = useState([]);
    const [tableData2, setTableData2] = useState([]);
    const [initialState, setInitialState] = useState({});
    const [columns, setColumns] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`${getApiUrl()}/search_employees`, {
                    method: "POST",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const data = await response.json();
                if (data.error === "Usuario no ha iniciado sesion.") {
                    navigate("/");
                    console.error("error:" + data + data.error);
                } else if ("info" in data) {
                    setTableData(data.info.data);
                    setTableData2(data.info.data[0]);
                    // filterColumns(data.info.data[0]);
                    setPermissions(data.permissions);
                    setTransition(!transition);
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
                setTransition(!transition);
            }
        };
        fetchEmployees();

        const intervalId = setInterval(() => {
            fetchEmployees();
        }, 10 * 30 * 1000);
        return () => clearTimeout(intervalId);
    }, []);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 12,
    });

    const handleFirstPage = () => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    };

    const handleLastPage = () => {
        setPaginationModel((prev) => ({ ...prev, page: Math.ceil(rows.length / prev.pageSize) - 1 }));
    };

    useEffect(() => {
        console.log(tableData2);
        const backendKeys = Object.keys(tableData2);
        const filteredKeys = backendKeys.filter((key) => arrayData.some((item) => item.inputs.some((input) => input.name === key)));

        // Generate columns based on filtered keys
        const filteredColumns = filteredKeys.map((key) => {
            const inputItem = arrayData.find((item) => item.inputs.some((input) => input.name === key));

            const input = inputItem.inputs.find((input) => input.name === key);

            const column = {
                field: key,
                headerName: input.label,
                width: 200, // Set the desired width here
                valueFormatter: (params) => {
                    const value = params.value;
                    if (value === "" || value === null || value === undefined) {
                        return "-";
                    } else {
                        return value;
                    }
                },
            };

            return column;
        });

        filteredColumns.push({
            field: "detalles",
            headerName: "Detalles",
            width: 65,
            disableExport: true,
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

        const hiddenColumns = filteredColumns.map((column) => column.field);
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

        const createInitialState = {
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
        };

        setColumns(filteredColumns);
        setInitialState(createInitialState);
    }, [tableData2]);

    const filterColumns = (data) => {
        const backendKeys = Object.keys(data);
        const filteredKeys = backendKeys.filter((key) => arrayData.some((item) => item.inputs.some((input) => input.name === key)));

        // Generate columns based on filtered keys
        const filteredColumns = filteredKeys.map((key) => {
            const inputItem = arrayData.find((item) => item.inputs.some((input) => input.name === key));

            const input = inputItem.inputs.find((input) => input.name === key);

            const column = {
                field: key,
                headerName: input.label,
                width: 200, // Set the desired width here
                valueFormatter: (params) => {
                    const value = params.value;
                    if (value === "" || value === null || value === undefined) {
                        return "-";
                    } else {
                        return value;
                    }
                },
            };

            return column;
        });

        filteredColumns.push({
            field: "detalles",
            headerName: "Detalles",
            width: 65,
            disableExport: true,
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

        const hiddenColumns = filteredColumns.map((column) => column.field);
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

        const createInitialState = {
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
        };

        setColumns(filteredColumns);
        setInitialState(createInitialState);
        // const hiddenColumns = filteredColumns.map((column) => column.field);

        // const columnVisibilityModel = {
        //     ...hiddenColumns.reduce((acc, field) => ({ ...acc, [field]: false }), {}),
        //     cedula: true,
        //     nombre: true,
        //     campana: true,
        //     cargo: true,
        //     fecha_ingreso: true,
        //     salario: true,
        //     detalles: true,
        //     campana_general: true,
        // };

        // const columns = arrayData.flatMap((page) => {
        //     return page.inputs
        //         .filter((input) => input.name !== "antiguedad" && input.name !== "edad" && input.name !== "desempeño")
        //         .map((input) => {
        //             if (input.name == "cedula") {
        //                 return {
        //                     field: input.name,
        //                     headerName: input.label,
        //                     width: 110,
        //                     valueFormatter: (params) => {
        //                         let value = params.value;
        //                         if (value === "" || value === null || value === undefined) {
        //                             return "-";
        //                         } else {
        //                             return value;
        //                         }
        //                     },
        //                 };
        //             }

        //             if (
        //                 input.name == "fecha_nacimiento" ||
        //                 input.name == "fecha_expedicion" ||
        //                 input.name == "fecha_afiliacion_eps" ||
        //                 input.name == "fecha_nombramiento" ||
        //                 input.name == "fecha_ingreso" ||
        //                 input.name == "fecha_aplica_teletrabajo" ||
        //                 input.name == "fecha_retiro"
        //             ) {
        //                 return {
        //                     field: input.name,
        //                     headerName: input.label,
        //                     width: 100,
        //                     valueFormatter: (params) => {
        //                         let date = params.value;
        //                         if (date === null || date === undefined) {
        //                             return "-";
        //                         } else {
        //                             let options = { year: "numeric", month: "numeric", day: "numeric", timeZone: "UTC" };
        //                             return date.toLocaleString("es-ES", options);
        //                         }
        //                     },
        //                 };
        //             }

        //             if (input.name == "salario" || input.name == "subsidio_transporte") {
        //                 return {
        //                     field: input.name,
        //                     headerName: input.label,
        //                     width: 105,
        //                     type: "number",
        //                     valueFormatter: (params) => {
        //                         let salary = params.value;
        //                         if (salary === null || salary === undefined || salary === "") {
        //                             return "-";
        //                         } else {
        //                             let options = { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 };
        //                             return salary.toLocaleString("es-CO", options);
        //                         }
        //                     },
        //                 };
        //             } else if (input.name == "nombre") {
        //                 return {
        //                     field: input.name,
        //                     headerName: input.label,
        //                     width: 270,
        //                     valueFormatter: (params) => {
        //                         let value = params.value;
        //                         if (value === "" || value === null || value === undefined) {
        //                             return "-";
        //                         } else {
        //                             return value;
        //                         }
        //                     },
        //                 };
        //             } else {
        //                 return {
        //                     field: input.name,
        //                     headerName: input.label,
        //                     width: 210,
        //                     valueFormatter: (params) => {
        //                         let value = params.value;
        //                         if (value === "" || value === null || value === undefined) {
        //                             return "-";
        //                         } else {
        //                             return value;
        //                         }
        //                     },
        //                 };
        //             }
        //         });
        // });
    };

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
                <Button size="small" startIcon={<FirstPageIcon />} onClick={() => handleFirstPage()}>
                    First Page
                </Button>
                <Button size="small" startIcon={<LastPageIcon />} onClick={() => handleLastPage()}>
                    Last Page
                </Button>
                <Box sx={{ textAlign: "end", flex: "1" }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };

    useEffect(() => {
        console.log(tableData);
        // Define a function to format the date
        function formatDate(dateString) {
            let date = new Date(dateString);
            return date;
        }

        // Map over the tableData array and format the dates
        const formattedData = tableData.map((rowData) => {
            // Create a new object to store the formatted data
            const formattedRow = {};

            // Iterate through each property in the rowData object
            for (const [key, value] of Object.entries(rowData)) {
                if (
                    key === "fecha_nacimiento" ||
                    key === "fecha_expedicion" ||
                    key === "fecha_ingreso" ||
                    key === "fecha_retiro" ||
                    key === "fecha_aplica_teletrabajo" ||
                    key === "fecha_afiliacion_eps" ||
                    key === "fecha_nombramiento"
                ) {
                    // Format the date property
                    formattedRow[key] = formatDate(value);
                } else if (key === "estado") {
                    // Convert the "estado" property to "ACTIVO" or "RETIRADO"
                    formattedRow[key] = value ? "ACTIVO" : "RETIRADO";
                } else if (key === "otra_propiedad") {
                    // Add additional formatting logic for specific properties if needed
                    // Example: formattedRow[key] = someFormattingFunction(value);
                } else {
                    // For other properties, simply copy the value as is
                    formattedRow[key] = value;
                }
            }

            return formattedRow;
        });

        setOriginalData(formattedData);

        // Depending on your checked variable, you can filter the rows as before
        if (checked === true) {
            setRows(formattedData.filter((record) => record.estado !== "RETIRADO"));
        } else {
            setRows(formattedData);
        }
    }, [tableData]);

    // useEffect(() => {
    //     // Define a function to format the date
    //     function formatDate(dateString) {
    //         let date = new Date(dateString);
    //         return date;
    //     }

    //     // Loop through the tableData and format the dates
    //     for (let i = 0; i < tableData.length; i++) {
    //         for (let j = 0; j < tableData[i].length; j++) {
    //             if (typeof tableData[i][j] === "string" && tableData[i][j].includes("GMT")) {
    //                 tableData[i][j] = formatDate(tableData[i][j]);
    //             }
    //         }
    //     }

    //     // const newRows = tableData.map((row) =>
    //     //     columns.reduce((newRow, column, index) => {
    //     //         if (index === row.length - 1) {
    //     //             newRow[column.field] = row[index] ? "ACTIVO" : "RETIRADO";
    //     //         } else if (index === 47) {
    //     //             newRow[column.field] = row[index] ? "Si" : "No";
    //     //         } else if (index === 52) {
    //     //             if (index === false) {
    //     //                 newRow[column.field] = "No";
    //     //             } else if (index === true) {
    //     //                 newRow[column.field] = "Si";
    //     //             }
    //     //         } else {
    //     //             newRow[column.field] = row[index];
    //     //         }
    //     //         return newRow;
    //     //     }, {})
    //     // );

    //     setOriginalData(tableData);
    //     if (checked === true) {
    //         setRows(newRows.filter((record) => record.estado !== "RETIRADO"));
    //     } else {
    //         setRows(newRows);
    //     }
    // }, [tableData]);

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
            pagination
            getRowId={(row) => row.cedula}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
                setPaginationModel(model);
            }}
            rows={rows}
            checkboxSelection
            initialState={initialState}
            pageSizeOptions={[12]}
            disableRowSelectionOnClick
        />
    );
};

export default TableEmployees;
