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
import Papa from "papaparse";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

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
    tableData,
    setTableData,
    handleOpenDialog,
    handleOpenMaternityDialog,
}) => {
    const [rol, setRole] = useState();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 12,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`${getApiUrl()}/search_employees`, {
                    method: "POST",
                    credentials: "include",
                    contentEncoding: "br",
                });
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const data = await response.json();
                if (data.error === "Usuario no ha iniciado sesión.") {
                    navigate("/");
                    console.error("error:" + data + data.error);
                } else if ("info" in data) {
                    // log just the item with the id === 1001185399
                    const item = data.info.data.find((item) => item.cedula === 1001185389);
                    console.log(item);
                    setRole(data.rol);
                    addFields(data.info.data);
                    setPermissions(data.permissions);
                    setTransition(!transition);
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + error, true);
                setTransition(!transition);
            }
        };
        fetchEmployees();

        const intervalId = setInterval(() => {
            fetchEmployees();
        }, 10 * 30 * 1000);
        return () => clearTimeout(intervalId);
    }, []);

    const calculateAge = (birthday) => {
        const birthDate = new Date(birthday);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
            return age - 1 + " AÑOS";
        } else {
            return age + " AÑOS";
        }
    };

    const calculateSeniority = (affiliationDate) => {
        if (affiliationDate === undefined) return;

        const fechaIngreso = new Date(affiliationDate);
        const fechaActual = new Date();
        const monthsDiff = (fechaActual.getFullYear() - fechaIngreso.getFullYear()) * 12 + (fechaActual.getMonth() - fechaIngreso.getMonth());

        const years = Math.floor(monthsDiff / 12);
        const months = monthsDiff % 12;

        const yearText = years === 1 ? "AÑO" : "AÑOS";
        const monthText = months === 1 ? "MES" : "MESES";

        const yearString = years > 0 ? `${years} ${yearText}` : "";
        const monthString = months > 0 ? `${months} ${monthText}` : "";

        return `${yearString}${yearString && monthString ? " Y " : ""}${monthString}`;
    };

    const addFields = (tableData) => {
        const newData = tableData.map((item) => {
            const age = item.fecha_nacimiento ? calculateAge(item.fecha_nacimiento) : undefined;
            const seniority = item.fecha_ingreso ? calculateSeniority(item.fecha_ingreso) : undefined;
            const completeName = item.apellidos && item.nombres ? item.apellidos + " " + item.nombres : item.nombres;

            // ignore the items nombres y apellidos
            delete item.nombres;
            delete item.apellidos;

            return {
                ...item,
                nombre_completo: completeName,
                ...(item.fecha_nacimiento && item.fecha_ingreso
                    ? { edad: age, antiguedad: seniority }
                    : item.fecha_nacimiento
                    ? { edad: age }
                    : item.fecha_ingreso
                    ? { antiguedad: seniority }
                    : {}),
            };
        });

        setTableData(newData);
    };

    useEffect(() => {
        addFields(tableData);
    }, []);

    let backendKeys = [];
    if (tableData[0]) {
        backendKeys = Object.keys(tableData[0]);
    }

    const filteredKeys = [];

    arrayData.forEach((item) => {
        item.inputs.forEach((input) => {
            const key = input.name;
            if (backendKeys.includes(key) && !filteredKeys.includes(key)) {
                filteredKeys.push(key);
            }
        });
    });

    // Generate columns based on filtered keys
    const filteredColumns = filteredKeys.map((key) => {
        const inputItem = arrayData.find((item) => item.inputs.some((input) => input.name === key));

        const input = inputItem.inputs.find((input) => input.name === key);

        let column = {
            field: key,
            headerName: input.label,
            width: 210,
            valueFormatter: (params) => {
                const value = params.value;
                if (value === "" || value === null || value === undefined) {
                    return "-";
                } else {
                    return value;
                }
            },
        };

        if (key === "cedula") {
            column.width = 106;
        } else if (key === "estado") {
            column.width = 95;
        } else if (
            ["fecha_nacimiento", "fecha_expedicion", "fecha_afiliacion_eps", "fecha_nombramiento", "fecha_ingreso", "fecha_aplica_teletrabajo", "fecha_retiro"].includes(
                key
            )
        ) {
            column.width = 100;
            column.valueFormatter = (params) => {
                let date = params.value;
                if (date === null || date === undefined) {
                    return "-";
                } else {
                    let options = { year: "numeric", month: "numeric", day: "numeric", timeZone: "UTC" };
                    return date.toLocaleString("es-ES", options);
                }
            };
        } else if (key === "salario" || key === "subsidio_transporte") {
            column.width = 105;
            column.type = "number";
            column.valueFormatter = (params) => {
                let salary = params.value;
                if (salary === null || salary === undefined || salary === "") {
                    return "-";
                } else {
                    let options = { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 };
                    return salary.toLocaleString("es-CO", options);
                }
            };
        } else if (key === "antiguedad") {
            column.sortComparator = (v1, v2, cell1, cell2) => {
                const seniorityToMonths = (seniorityString) => {
                    let years = 0;
                    let months = 0;

                    const yearsMatch = seniorityString.match(/(\d+)\s*AÑO/);
                    if (yearsMatch) {
                        years = parseInt(yearsMatch[1]);
                    }

                    const monthsMatch = seniorityString.match(/(\d+)\s*MES/);
                    if (monthsMatch) {
                        months = parseInt(monthsMatch[1]);
                    }

                    return years * 12 + months;
                };

                return seniorityToMonths(v1) - seniorityToMonths(v2);
            };
        } else if (key === "nombre_completo") {
            column.width = 270;
        }

        return column;
    });

    const hiddenColumns = filteredColumns.map((column) => column.field);

    if (rol !== undefined && rol === "gestion") {
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
    } else if (rol === "test") {
        filteredColumns.push({
            field: "windows-user-action",
            headerName: "Usuario Windows",
            width: 65,
            disableExport: true,
            renderCell: (params) => {
                const { row } = params;
                return (
                    <Tooltip title="Usuario de Windows">
                        <IconButton color="primary" onClick={() => handleOpenDialog(row.usuario_windows, row.cedula)}>
                            <AccountCircleIcon />
                        </IconButton>
                    </Tooltip>
                );
            },
        });
    } else if (rol === "sst-maternity") {
        filteredColumns.push({
            field: "maternity-action",
            headerName: "Maternidad",
            width: 65,
            disableExport: true,
            renderCell: (params) => {
                const { row } = params;
                return (
                    <Tooltip title="Maternidad">
                        <IconButton
                            color="primary"
                            onClick={() =>
                                handleOpenMaternityDialog(
                                    row.cedula,
                                    row.caso_medico_especial,
                                    row.fecha_inicio_embarazo,
                                    row.fecha_fin_embarazo,
                                    row.licencia_maternidad,
                                    row.fecha_inicio_licencia,
                                    row.fecha_fin_licencia
                                )
                            }
                        >
                            <PregnantWomanIcon />
                        </IconButton>
                    </Tooltip>
                );
            },
        });
    }

    let columnVisibilityModel;
    if (rol === "gestion") {
        columnVisibilityModel = {
            ...Object.fromEntries(hiddenColumns.map((field) => [field, false])),
            cedula: true,
            nombre_completo: true,
            cargo: true,
            fecha_ingreso: true,
            salario: true,
            detalles: true,
            campana_general: true,
        };
    }

    let keys = [];
    if (columnVisibilityModel) {
        keys = Object.keys(columnVisibilityModel);
    }

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

    const handleFirstPage = () => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    };

    const handleLastPage = () => {
        setPaginationModel((prev) => ({ ...prev, page: Math.ceil(rows.length / prev.pageSize) - 1 }));
    };

    const CustomToolbar = (props) => {
        const apiRef = useGridApiContext();
        const handleExport = async () => {
            setShowSnackAlert("success", "El excel esta siendo procesado, por favor espera unos minutos");
            const csvOptions = { delimiter: ";", utf8WithBom: true };
            let result = apiRef.current.getDataAsCsv(csvOptions);

            try {
                const response = await fetch(`${getApiUrl()}/download`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "text/csv",
                    },
                    body: result,
                    contentEncoding: "br",
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
                    // Create a Date object to get the current date and time
                    const currentDate = new Date();

                    // Define a function to format the date as yyyy-mm-dd
                    function formatDate(date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 to month since it's zero-based
                        const day = String(date.getDate()).padStart(2, "0");
                        return `${year}-${month}-${day}`;
                    }

                    // Get the formatted current date
                    const formattedDate = formatDate(currentDate);

                    // Construct the new file name with the current date
                    const newFileName = `staffnet-${formattedDate}.xlsx`;

                    // Set the "download" attribute with the new file name
                    link.setAttribute("download", newFileName);
                    document.body.appendChild(link);
                    link.click();
                } else {
                    console.error(response.status + response.statusText);
                    setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + response.statusText, true);
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + error, true);
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
            if (dateString) {
                let date = new Date(dateString);
                return date;
            }
        }

        // Define a function to format the estado property
        function formatEstado(value) {
            return value ? "ACTIVO" : "RETIRADO";
        }

        // Define a function to format aplica_teletrabajo and aplica_recontratacion properties
        function formatBoolean(value) {
            if (value === null) {
                return "-";
            } else if (value === 0) {
                return "NO";
            } else if (value === 1) {
                return "SI";
            }
        }

        // Map over the tableData array and format the data
        const formattedData = tableData.map((rowData) => {
            // Create a new object to store the formatted data
            const formattedRow = {};

            // Iterate through each property in the rowData object
            for (const [key, value] of Object.entries(rowData)) {
                if (
                    [
                        "fecha_nacimiento",
                        "fecha_expedicion",
                        "fecha_ingreso",
                        "fecha_retiro",
                        "fecha_aplica_teletrabajo",
                        "fecha_afiliacion_eps",
                        "fecha_nombramiento",
                        "fecha_inicio_embarazo",
                        "fecha_fin_embarazo",
                        "fecha_inicio_licencia",
                        "fecha_fin_licencia",
                    ].includes(key)
                ) {
                    // Format the date property
                    formattedRow[key] = formatDate(value);
                } else if (key === "estado") {
                    // Format the estado property
                    formattedRow[key] = formatEstado(value);
                } else if (["aplica_teletrabajo", "aplica_recontratacion"].includes(key)) {
                    // Format aplica_teletrabajo and aplica_recontratacion properties
                    formattedRow[key] = formatBoolean(value);
                } else {
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

    const generateDataGridOptions = useMemo(() => {
        const commonOptions = {
            initialState: createInitialState,
            columns: filteredColumns,
            rows: rows,
            slots: slots,
            pageSizeOptions: [12, 24, 36],
            paginationModel: paginationModel,
            onPaginationModelChange: (model) => {
                setPaginationModel(model);
            },
            getRowId: (row) => row.cedula,
            GridColDef: "center",
            checkboxSelection: true,
            disableRowSelectionOnClick: true,
            pagination: true,
            sx: {
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
            },
        };

        return commonOptions;
    }, [createInitialState, filteredColumns, rows, slots, paginationModel, setPaginationModel, cycLogo]);

    let dataGridOptions = generateDataGridOptions;

    if (rol !== undefined && rol !== "gestion" && filteredColumns.length) {
        return <DataGrid {...dataGridOptions} />;
    } else if (filteredColumns.length > 1 && keys.length > 7) {
        return <DataGrid {...dataGridOptions} />;
    }
};

export default TableEmployees;
