import React from "react";
import { getApiUrl } from "../assets/getApi.js";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EmployeeHistory from "./EmployeeHistory.jsx";

const EditModal = ({
    arrayData,
    inputValues,
    handleEdit,
    openModal,
    setOpenModal,
    setProgressBar,
    stylesModal,
    searchEmployeesUpdate,
    setShowSnackAlert,
    permissions,
    edit,
    dataCalculateAge,
    seniority,
    cedulaDetails,
    handleChange,
    setEdit,
    setDetalles,
}) => {
    const submitEdit = (event) => {
        setProgressBar(true);
        event.preventDefault();
        const updateTransaction = async () => {
            try {
                const response = await fetch(`${getApiUrl()}/update_transaction`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inputValues),
                    contentEncoding: "br",
                });
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const data = await response.json();
                setProgressBar(false);
                if (data.status === "success") {
                    searchEmployeesUpdate();
                    handleCloseModal();
                    setShowSnackAlert("success", "Edición realizada correctamente");
                }
                if (data.error === "No hubo ningun cambio") {
                    setShowSnackAlert("info", "No se ha realizo ningun cambio");
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
            }
        };
        updateTransaction();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEdit(true);
        setDetalles({});
    };

    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ display: "flex", borderRadius: "30px" }}
        >
            <Fade in={openModal}>
                <Box sx={stylesModal} component="form" onSubmit={submitEdit}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mx: "10px",
                        }}
                    >
                        {permissions.edit == 1 ? (
                            <Tooltip title="Editar">
                                <IconButton color="primary" onClick={() => handleEdit()}>
                                    <EditIcon></EditIcon>
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <IconButton disabled>
                                <EditIcon></EditIcon>
                            </IconButton>
                        )}
                        <Box sx={{ display: "flex", gap: "15px" }}>
                            <Button disabled={edit} type="submit">
                                <Box
                                    sx={{
                                        display: "flex",
                                        paddingRight: ".5em",
                                    }}
                                >
                                    <SaveIcon />
                                </Box>
                                Guardar
                            </Button>

                            <Tooltip title="Cancelar">
                                <IconButton
                                    onClick={handleCloseModal}
                                    sx={{
                                        "&:hover": {
                                            color: "#d32f2f",
                                        },
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    <List
                        sx={{
                            overflow: "auto",
                            maxHeight: "515px",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                            id="modal-modal-title"
                            variant="h5"
                            component="h3"
                        >
                            Detalles del empleado
                        </Typography>
                        <Box sx={{ p: 2 }}>
                            {arrayData.map((section) => (
                                <Box
                                    key={section.title}
                                    sx={{
                                        mb: 2,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        width: "100%",
                                        gap: "30px",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            width: "100%",
                                        }}
                                        variant="h6"
                                        component="h3"
                                    >
                                        {section.title}
                                    </Typography>
                                    {section.inputs.map((input) => {
                                        const getInputComponent = () => {
                                            if (
                                                input.name === "salario" ||
                                                input.name === "cuenta_nomina" ||
                                                input.name === "subsidio_transporte" ||
                                                input.name === "tel_fijo" ||
                                                input.name === "tel_contacto" ||
                                                input.name === "celular"
                                            ) {
                                                return (
                                                    <TextField
                                                        disabled={edit}
                                                        key={input.id}
                                                        sx={{
                                                            width: "20rem",
                                                        }}
                                                        name={input.name}
                                                        autoComplete="off"
                                                        label={input.label}
                                                        value={
                                                            inputValues[input.name] !== undefined && inputValues[input.name] !== null && inputValues[input.name] !== ""
                                                                ? inputValues[input.name]
                                                                : ""
                                                        }
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        onChange={(event) => handleChange(event, input)}
                                                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                                    />
                                                );
                                            }
                                            if (input.id === "observaciones") {
                                                return (
                                                    <TextField
                                                        disabled={edit}
                                                        key={input.id}
                                                        name={input.name}
                                                        label={input.label}
                                                        type={input.type}
                                                        multiline
                                                        rows={4}
                                                        sx={{
                                                            width: "100%",
                                                        }}
                                                        value={
                                                            inputValues[input.name] !== undefined && inputValues[input.name] !== null && inputValues[input.name] !== ""
                                                                ? inputValues[input.name]
                                                                : ""
                                                        }
                                                        onChange={(event) => handleChange(event, input)}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                );
                                            } else if (input.id === "antiguedad") {
                                                return (
                                                    <TextField
                                                        disabled
                                                        key={input.id}
                                                        name={input.name}
                                                        label={input.label}
                                                        type={input.type}
                                                        sx={{
                                                            width: "20rem",
                                                        }}
                                                        value={seniority || ""}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                );
                                            }
                                            if (input.id === "5") {
                                                return (
                                                    <TextField
                                                        disabled
                                                        key={input.id}
                                                        name={input.name}
                                                        label={input.label}
                                                        type={input.type}
                                                        sx={{
                                                            width: "20rem",
                                                        }}
                                                        value={dataCalculateAge}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                );
                                            }
                                            if (
                                                input.id === "1" ||
                                                input.id === "fecha_nombramiento_legado" ||
                                                input.id === "cambio_campaña_legado" ||
                                                input.id === "cambio_eps_legado"
                                            ) {
                                                return (
                                                    <TextField
                                                        disabled
                                                        key={input.id}
                                                        name={input.name}
                                                        label={input.label}
                                                        type={input.type}
                                                        sx={{
                                                            width: "20rem",
                                                        }}
                                                        value={
                                                            inputValues[input.name] !== undefined && inputValues[input.name] !== null && inputValues[input.name] !== ""
                                                                ? inputValues[input.name]
                                                                : ""
                                                        }
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                );
                                            }
                                            if (input.id === 61 && permissions.disable === 0) {
                                                return (
                                                    <TextField
                                                        disabled
                                                        key={input.id}
                                                        name={input.name}
                                                        label={input.label}
                                                        type={input.type}
                                                        sx={{
                                                            width: "20rem",
                                                        }}
                                                        value={inputValues[input.name] !== undefined && inputValues[input.name] !== "" ? inputValues[input.name] : ""}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                );
                                            }
                                            if (input.type === "select") {
                                                const optionExists = input.options.some((option) => option.value === inputValues[input.name]);

                                                if (!optionExists) {
                                                    input.options.push({
                                                        value: inputValues[input.name],
                                                        label: inputValues[input.name],
                                                    });
                                                }

                                                return (
                                                    <TextField
                                                        select
                                                        disabled={edit}
                                                        key={input.id}
                                                        sx={{
                                                            width: "20rem",
                                                        }}
                                                        name={input.name}
                                                        autoComplete="off"
                                                        variant="outlined"
                                                        label={input.label}
                                                        onChange={(event) => handleChange(event, input)}
                                                        value={
                                                            inputValues[input.name] !== undefined && inputValues[input.name] !== null && inputValues[input.name] !== ""
                                                                ? inputValues[input.name]
                                                                : ""
                                                        }
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    >
                                                        {input.options.map((option, index) => (
                                                            <MenuItem key={index} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                );
                                            }
                                            return (
                                                <TextField
                                                    disabled={edit}
                                                    key={input.id}
                                                    sx={{
                                                        width: "20rem",
                                                    }}
                                                    type={input.type}
                                                    name={input.name}
                                                    autoComplete="off"
                                                    label={input.label}
                                                    value={
                                                        inputValues[input.name] !== undefined && inputValues[input.name] !== null && inputValues[input.name] !== ""
                                                            ? inputValues[input.name]
                                                            : ""
                                                    }
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    onChange={(event) => handleChange(event, input)}
                                                />
                                            );
                                        };
                                        return getInputComponent();
                                    })}
                                </Box>
                            ))}
                            <EmployeeHistory setShowSnackAlert={setShowSnackAlert} cedulaDetails={cedulaDetails} />
                        </Box>
                    </List>
                </Box>
            </Fade>
        </Modal>
    );
};

export default EditModal;
