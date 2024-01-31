import React, { useState, useRef } from "react";
import { Dialog, DialogTitle, TextField, Button, Box } from "@mui/material";

const WindowsUserDialog = () => {
    const [openWindowsUserDialog, setOpenWindowsUserDialog] = useState(false);
    const nameAddVacancy = useRef(null);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFileName("Cargar Archivo");
        setSelectedFile(null);
    };

    return (
        <Dialog open={openWindowsUserDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"¿Desea añadir una nueva vacante?"}</DialogTitle>

            <Box sx={{ flexDirection: "column", p: "1rem 1.5rem ", display: "flex", alignItems: "start" }}>
                <TextField inputRef={nameAddVacancy} sx={{ width: "400px", mb: "1rem" }} label="Nombre de la Vacante"></TextField>
                <Box sx={{ display: "flex", height: "56px", justifyContent: "center", width: "400px" }}>
                    <Button sx={{ width: "100%", overflow: "hidden" }} variant="outlined" component="label" startIcon={<CloudUploadIcon />}></Button>
                </Box>
                <Box sx={{ display: "flex", gap: "2rem" }}>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={submitAddVacancy}>Guardar</Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default WindowsUserDialog;
