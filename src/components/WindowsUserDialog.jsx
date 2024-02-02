import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogTitle, TextField, Button, Box } from "@mui/material";
import { getApiUrl } from "../assets/getApi";
import SnackAlert from "./SnackAlert";

const WindowsUserDialog = ({ searchEmployeesUpdate, setShowSnackAlert, openWindowsUserDialog, handleCloseDialog, cedula, windowsUser }) => {
    const usuarioWindows = useRef(null);

    const submitUserWindows = async (event) => {
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
            handleCloseDialog();
            setShowSnackAlert("success", "Empleado añadido correctamente");
        }
    };

    return (
        <Dialog open={openWindowsUserDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="añadir usuario windows">{"Añadir Usuario de Windows"}</DialogTitle>

            <Box onSubmit={submitUserWindows} component="form" sx={{ flexDirection: "column", p: "1rem 1.5rem ", display: "flex", alignItems: "start" }}>
                <TextField inputRef={usuarioWindows} sx={{ width: "400px", mb: "1rem" }} defaultValue={windowsUser} label="Usuario de Windows"></TextField>
                <Box sx={{ display: "flex", gap: "2rem" }}>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default WindowsUserDialog;
