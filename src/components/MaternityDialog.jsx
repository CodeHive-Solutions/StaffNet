import React, { useRef } from "react";
import { Dialog, DialogTitle, TextField, Button, Box, MenuItem, Collapse } from "@mui/material";
import { getApiUrl } from "../assets/getApi";

const MaternityDialog = ({
    openPregnantCollapse,
    setOpenPregnantCollapse,
    searchEmployeesUpdate,
    setShowSnackAlert,
    openMaternityDialog,
    handleCloseMaternityDialog,
    cedula,
    casoMedicoEspecial,
    fechaInicioLicencia,
    fechaFinLicencia,
    openMaternityCollapse,
    setOpenMaternityCollapse,
    permissions,
    rol,
}) => {
    const inputCasoMedicoEspecial = useRef(null);
    const inputFechaInicioLicencia = useRef(null);
    const inputFechaFinLicencia = useRef(null);
    const editPermission = permissions.edit || rol === "sst-maternity";

    const handleChangeInput = (event) => {
        if (event.target.value === "LICENCIA MATERNIDAD") {
            setOpenMaternityCollapse(true);
        } else {
            setOpenMaternityCollapse(false);
        }
    };

    const submitMaternityData = async (event) => {
        event.preventDefault();

        const getInputValue = (inputRef) => inputRef.current?.value;
        const casoMedicoEspecialValue = getInputValue(inputCasoMedicoEspecial);
        const fechaInicioLicenciaValue = getInputValue(inputFechaInicioLicencia);
        const fechaFinLicenciaValue = getInputValue(inputFechaFinLicencia);

        const jsonData = {
            cedula: cedula,
            value: [],
            column: [],
            table: "personal_information",
        };

        const addField = (condition, value, columnName) => {
            if (condition) {
                if (value === "") {
                    value = null;
                }
                jsonData.value.push(value);
                jsonData.column.push(columnName);
            }
        };

        addField(true, casoMedicoEspecialValue, "caso_medico");

        if (casoMedicoEspecialValue !== "LICENCIA MATERNIDAD") {
            addField(true, null, "fecha_inicio_licencia");
            addField(true, null, "fecha_fin_licencia");
        } else {
            addField(fechaInicioLicenciaValue, fechaInicioLicenciaValue, "fecha_inicio_licencia");
            addField(fechaFinLicenciaValue, fechaFinLicenciaValue, "fecha_fin_licencia");
        }

        try {
            const response = await fetch(`${getApiUrl()}/update`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            });

            if (response.status === 200) {
                searchEmployeesUpdate();
                handleCloseMaternityDialog();
                setShowSnackAlert("success", "Datos actualizados correctamente");
            } else if (response.status === 403) {
                setShowSnackAlert("error", "No tiene permisos para actualizar los datos");
            } else {
                // Handle other status codes appropriately
                console.error(`Error: ${response.statusText}`);
                setShowSnackAlert("error", "Error al actualizar los datos");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setShowSnackAlert("error", "Error al actualizar los datos");
        }
    };

    return (
        <Dialog open={openMaternityDialog} onClose={handleCloseMaternityDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="editar-campos-maternidad">{"Editar campos"}</DialogTitle>
            <Box onSubmit={submitMaternityData} component="form" sx={{ flexDirection: "column", p: "1rem 1.5rem ", display: "flex", alignItems: "start" }}>
                <TextField
                    select
                    disabled={!editPermission}
                    onChange={(event) => handleChangeInput(event)}
                    inputRef={inputCasoMedicoEspecial}
                    sx={{ width: "400px", mb: "1rem" }}
                    defaultValue={casoMedicoEspecial || ""}
                    label="Caso Medico"
                >
                    <MenuItem value={"EMBARAZO"}>Embarazo</MenuItem>
                    <MenuItem value={"LICENCIA MATERNIDAD"}>Licencia Maternidad</MenuItem>
                    <MenuItem value={"LICENCIA PATERNIDAD"}>Licencia Paternidad</MenuItem>
                    <MenuItem value={"LACTANCIA 6 MESES"}>Lactancia 6 Meses</MenuItem>
                    <MenuItem value={"LACTANCIA 6-12 MESES"}>Lactancia 6-12 Meses</MenuItem>
                    <MenuItem value={"LACTANCIA 12-18 MESES"}>Lactancia 12-18 Meses</MenuItem>
                    <MenuItem value={"CASO MEDICO ESPECIAL"}>Caso Medico Especial</MenuItem>
                    <MenuItem value={"INCAPACIDADES LARGAS"}>Incapacidades Largas</MenuItem>
                    <MenuItem value={null}></MenuItem>
                </TextField>
                <Collapse unmountOnExit sx={{ width: "min-content" }} in={openMaternityCollapse}>
                    <TextField
                        type="date"
                        disabled={!editPermission}
                        inputRef={inputFechaInicioLicencia}
                        sx={{ width: "400px", mb: "1rem" }}
                        defaultValue={fechaInicioLicencia}
                        label="Fecha de inicio de licencia"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    ></TextField>
                    <TextField
                        type="date"
                        disabled={!editPermission}
                        inputRef={inputFechaFinLicencia}
                        sx={{ width: "400px", mb: "1rem" }}
                        defaultValue={fechaFinLicencia}
                        label="Fecha de fin de licencia"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    ></TextField>
                </Collapse>
                <Box sx={{ display: "flex", gap: "2rem" }}>
                    <Button onClick={handleCloseMaternityDialog}>Cancelar</Button>
                    <Button disabled={!editPermission} type="submit">
                        Guardar
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default MaternityDialog;
