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
    fechaInicioEmbarazo,
    fechaFinEmbarazo,
    licenciaMaternidad,
    fechaInicioLicencia,
    fechaFinLicencia,
    openMaternityCollapse,
    setOpenMaternityCollapse,
}) => {
    const inputCasoMedicoEspecial = useRef(null);
    const inputFechaInicioEmbarazo = useRef(null);
    const inputFechaFinEmbarazo = useRef(null);
    const inputLicenciaMaternidad = useRef(null);
    const inputFechaInicioLicencia = useRef(null);
    const inputFechaFinLicencia = useRef(null);

    const handleChangeInput = (event) => {
        if (event.target.value === "EMBARAZO") {
            setOpenPregnantCollapse(true);
        } else {
            setOpenPregnantCollapse(false);
            setOpenMaternityCollapse(false);
        }
    };

    const submitMaternityData = async (event) => {
        event.preventDefault();
        const casoMedicoEspecialValue = inputCasoMedicoEspecial.current.value;
        const fechaInicioEmbarazoValue = inputFechaInicioEmbarazo.current.value;
        const fechaFinEmbarazoValue = inputFechaFinEmbarazo.current.value;
        const licenciaMaternidadValue = inputLicenciaMaternidad.current.value;
        const fechaInicioLicenciaValue = inputFechaInicioLicencia.current.value;
        const fechaFinLicenciaValue = inputFechaFinLicencia.current.value;

        const jsonData = {
            cedula: cedula,
            value: { casoMedicoEspecialValue, fechaInicioEmbarazoValue, fechaFinEmbarazoValue, licenciaMaternidadValue, fechaInicioLicenciaValue, fechaFinLicenciaValue },
            column: "caso_medico, fecha_inicio_embarazo, fecha_fin_embarazo, licencia_maternidad, fecha_inicio_licencia, fecha_fin_licencia",
            table: "personal_information",
        };

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
            setShowSnackAlert("success", "Empleado añadido correctamente");
        }
    };

    return (
        <Dialog open={openMaternityDialog} onClose={handleCloseMaternityDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="editar-campos-maternidad">{"Editar campos"}</DialogTitle>
            <Box onSubmit={submitMaternityData} component="form" sx={{ flexDirection: "column", p: "1rem 1.5rem ", display: "flex", alignItems: "start" }}>
                <TextField
                    select
                    onChange={handleChangeInput}
                    inputRef={inputCasoMedicoEspecial}
                    sx={{ width: "400px", mb: "1rem" }}
                    defaultValue={casoMedicoEspecial || ""}
                    label="Caso Medico"
                >
                    <MenuItem value={"EMBARAZO"}>Embarazo</MenuItem>
                    <MenuItem value={"LICENCIA PATERNIDAD"}>Licencia Paternidad</MenuItem>
                    <MenuItem value={"LACTANCIA 6 MESES"}>Lactancia 6 Meses</MenuItem>
                    <MenuItem value={"LACTANCIA 6-12 MESES"}>Lactancia 6-12 Meses</MenuItem>
                    <MenuItem value={"LACTANCIA 12-18 MESES"}>Lactancia 12-18 Meses</MenuItem>
                    <MenuItem value={"CASO MEDICO ESPECIAL"}>Caso Medico Especial</MenuItem>
                    <MenuItem value={"INCAPACIDADES LARGAS"}>Incapacidades Largas</MenuItem>
                </TextField>
                <Collapse sx={{ width: "min-content" }} unmountOnExit in={openPregnantCollapse}>
                    <TextField
                        type="date"
                        required
                        inputRef={inputFechaInicioEmbarazo}
                        sx={{ width: "400px", mb: "1rem" }}
                        defaultValue={fechaInicioEmbarazo || ""}
                        label="Fecha de inicio de Embarazo"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    ></TextField>
                    <TextField
                        type="date"
                        required
                        inputRef={inputFechaFinEmbarazo}
                        sx={{ width: "400px", mb: "1rem" }}
                        defaultValue={fechaFinEmbarazo}
                        label="Fecha de fin de Embarazo"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    ></TextField>
                    <TextField
                        inputRef={inputLicenciaMaternidad}
                        onChange={(event) => {
                            if (event.target.value === "1") {
                                setOpenMaternityCollapse(true);
                                inputFechaInicioLicencia.current.required = true;
                                inputFechaFinLicencia.current.required = true;
                            } else {
                                setOpenMaternityCollapse(false);
                                inputFechaInicioLicencia.current.required = false;
                                inputFechaFinLicencia.current.required = false;
                            }
                        }}
                        required
                        select
                        sx={{ width: "400px", mb: "1rem" }}
                        defaultValue={licenciaMaternidad || ""}
                        label="Licencia de Maternidad"
                    >
                        <MenuItem value={"1"}>Si</MenuItem>
                        <MenuItem value={"0"}>No</MenuItem>
                    </TextField>
                    <Collapse in={openMaternityCollapse}>
                        <TextField
                            type="date"
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
                            inputRef={inputFechaFinLicencia}
                            sx={{ width: "400px", mb: "1rem" }}
                            defaultValue={fechaFinLicencia}
                            label="Fecha de fin de licencia"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        ></TextField>
                    </Collapse>
                </Collapse>
                <Box sx={{ display: "flex", gap: "2rem" }}>
                    <Button onClick={handleCloseMaternityDialog}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default MaternityDialog;
