import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogTitle, TextField, Button, Box, MenuItem, Collapse } from "@mui/material";
import { getApiUrl } from "../assets/getApi";

const MaternityDialog = ({
    searchEmployeesUpdate,
    setShowSnackAlert,
    openMaternityDialog,
    handleCloseMaternityDialog,
    cedula,
    casoMedicoEspecial,
    embarazo,
    licenciaMaternidad,
    lactancia,
}) => {
    const inputCasoMedicoEspecial = useRef(null);
    const inputEmbarazo = useRef(null);
    const inputLicenciaMaternidad = useRef(null);
    const inputLactancia = useRef(null);
    const [openPregnantCollapse, setOpenPregnantCollapse] = useState(false);

    const handleChangeInput = (event) => {
        if (event.target.value === "EMBARAZO") {
            setOpenPregnantCollapse(true);
        } else {
            setOpenPregnantCollapse(false);
        }
    };

    const submitMaternityData = async (event) => {
        event.preventDefault();
        const usuario = usuarioWindows.current.value;

        const jsonData = {
            cedula: cedula,
            value: usuario,
            column: "usuario_windows",
            table: "employment_information",
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
                <TextField select onChange={handleChangeInput} inputRef={inputCasoMedicoEspecial} sx={{ width: "400px", mb: "1rem" }} defaultValue={casoMedicoEspecial} label="Caso Medico Especial">
                    <MenuItem value={"EMBARAZO"}>Embarazo</MenuItem>
                    <MenuItem value={"LICENCIA MATERNIDAD"}>Licencia Maternidad</MenuItem>
                    <MenuItem value={"LICENCIA PATERNIDAD"}>Licencia Paternidad</MenuItem>
                    <MenuItem value={"LACTANCIA 6 MESES"}>Lactancia 6 Meses</MenuItem>
                    <MenuItem value={"LACTANCIA 6-12 MESES"}>Lactancia 6-12 Meses</MenuItem>
                    <MenuItem value={"LACTANCIA 12-18 MESES"}>Lactancia 12-18 Meses</MenuItem>
                </TextField>
                <Collapse in={openPregnantCollapse}>
                    <TextField
                        type="date"
                        inputRef={inputLicenciaMaternidad}
                        sx={{ width: "400px", mb: "1rem" }}
                        defaultValue={licenciaMaternidad}
                        label="Fecha de inicio de Embarazo"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    ></TextField>
                    <TextField
                        type="date"
                        inputRef={inputLicenciaMaternidad}
                        sx={{ width: "400px", mb: "1rem" }}
                        defaultValue={licenciaMaternidad}
                        label="Fecha de fin de Embarazo"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    ></TextField>
                    <TextField
                        inputRef={inputLicenciaMaternidad}
                        select
                        sx={{ width: "400px", mb: "1rem" }}
                        defaultValue={licenciaMaternidad}
                        label="Licencia de Maternidad"
                    >
                        <MenuItem value={"SI"}>Si</MenuItem>
                        <MenuItem value={"NO"}>No</MenuItem>
                    </TextField>
                    <TextField
                        type="date"
                        inputRef={inputLicenciaMaternidad}
                        sx={{ width: "400px", mb: "1rem" }}
                        defaultValue={licenciaMaternidad}
                        label="Fecha de inicio de licencia"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    ></TextField>
                    <TextField
                        type="date"
                        inputRef={inputLicenciaMaternidad}
                        sx={{ width: "400px", mb: "1rem" }}
                        defaultValue={licenciaMaternidad}
                        label="Fecha de fin de licencia"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    ></TextField>
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
