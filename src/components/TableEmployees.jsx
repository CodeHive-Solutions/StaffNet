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

    let backendKeys = [];
    if (tableData[0]) {
        backendKeys = Object.keys(tableData[0]);
    }

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

    const hiddenColumns = filteredColumns.map((column) => column.field);

    const columnVisibilityModel = {
        ...hiddenColumns.reduce((acc, field) => ({ ...acc, [field]: false }), {}),
        cedula: true,
        nombre: true,
        cargo: true,
        fecha_ingreso: true,
        salario: true,
        detalles: true,
        campana_general: true,
    };

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
            pagination
            getRowId={(row) => row.cedula}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
                setPaginationModel(model);
            }}
            rows={rows}
            checkboxSelection
            initialState={createInitialState}
            columns={filteredColumns}
            pageSizeOptions={[12]}
            disableRowSelectionOnClick
        />
    );
};

export default TableEmployees;
