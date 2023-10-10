import React from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { getApiUrl } from "../assets/getApi.js";
import DirectionField from "../components/DirectionField.jsx";

const AddModal = ({ arrayData, openModalAdd, formData, setFormData, setOpenModalAdd, setProgressBar, searchEmployeesUpdate, stylesModal, setShowSnackAlert }) => {
    const validationSchema = Yup.object().shape({
        // Define your validation rules here for each form field
        // Example:
        salario: Yup.number().required("Salario is required"),
        // Add more fields as needed
    });

    const submitAdd = (event) => {
        event.preventDefault();
        setProgressBar(true);
        const insertTransaction = async (formData) => {
            try {
                const response = await fetch(`${getApiUrl()}/insert_transaction`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                    contentEncoding: "br",
                });
                setProgressBar(false);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (data.status === "success") {
                    searchEmployeesUpdate();
                    handleCloseModalAdd();
                    setShowSnackAlert("success", "Empleado añadido correctamente");
                } else {
                    console.error(data.error + "error alert");
                    setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + data.error.toString(), true);
                }
            } catch (error) {
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
            }
        };
        insertTransaction(formData);
    };

    const handleCloseModalAdd = () => setOpenModalAdd(false);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        console.log(formData);
    };

    return (
        <Modal
            open={openModalAdd}
            onClose={handleCloseModalAdd}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ display: "flex", borderRadius: "30px" }}
        >
            <Fade in={openModalAdd}>
                <Box sx={stylesModal} component="form" onSubmit={submitAdd}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mx: "10px",
                        }}
                    >
                        <Button type="submit">
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
                                onClick={handleCloseModalAdd}
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
                    <List
                        sx={{
                            overflow: "auto",
                            maxHeight: "505px",
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
                            Añadir empleado
                        </Typography>
                        <Box sx={{ p: 2 }}>
                            {arrayData.map((section) => {
                                const renderSelectInput = (input, formData, handleFormChange) => {
                                    if (input.id === "59" || input.id === "60" || input.id === "61") {
                                        return null;
                                    } else if (
                                        input.name == "eps" ||
                                        input.name == "pension" ||
                                        input.name == "cesantias" ||
                                        input.name == "caja_compensacion" ||
                                        input.name === "parentesco" ||
                                        input.name === "talla_camisa" ||
                                        input.name === "talla_pantalon" ||
                                        input.name === "talla_zapatos" ||
                                        input.name === "aplica_teletrabajo"
                                    ) {
                                        return (
                                            <TextField
                                                select
                                                sx={{
                                                    width: "20rem",
                                                }}
                                                key={input.id}
                                                name={input.name}
                                                onChange={handleFormChange}
                                                value={formData[input.name] !== undefined ? formData[input.name] : ""}
                                                variant="outlined"
                                                autoComplete="off"
                                                label={input.label}
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
                                            select
                                            required
                                            sx={{
                                                width: "20rem",
                                            }}
                                            key={input.id}
                                            name={input.name}
                                            onChange={handleFormChange}
                                            value={formData[input.name] !== undefined ? formData[input.name] : ""}
                                            variant="outlined"
                                            autoComplete="off"
                                            label={input.label}
                                        >
                                            {input.options.map((option, index) => (
                                                <MenuItem key={index} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    );
                                };

                                const renderTextInput = (input, formData, handleFormChange) => {
                                    // if (input.name == "direccion") {
                                    //     return <DirectionField key={input.id} handleFormChange={handleFormChange}></DirectionField>;
                                    // }

                                    if (input.name == "salario" || input.name == "cuenta_nomina" || input.name == "subsidio_transporte" || input.name === "celular") {
                                        return (
                                            <TextField
                                                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                                sx={{
                                                    width: "20rem",
                                                }}
                                                key={input.id}
                                                required
                                                name={input.name}
                                                InputLabelProps={{
                                                    shrink: input.shrink,
                                                }}
                                                onChange={handleFormChange}
                                                value={formData[input.name] || ""}
                                                autoComplete="off"
                                                label={input.label}
                                            />
                                        );
                                    } else if (input.name === "tel_fijo" || input.name === "tel_contacto") {
                                        return (
                                            <TextField
                                                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                                sx={{
                                                    width: "20rem",
                                                }}
                                                key={input.id}
                                                name={input.name}
                                                InputLabelProps={{
                                                    shrink: input.shrink,
                                                }}
                                                onChange={handleFormChange}
                                                value={formData[input.name] || ""}
                                                autoComplete="off"
                                                label={input.label}
                                            />
                                        );
                                    } else if (
                                        input.name === "profesion" ||
                                        input.name === "correo_corporativo" ||
                                        input.name === "estudios_en_curso" ||
                                        input.name === "contacto_emergencia" ||
                                        input.name === "subsidio_transporte" ||
                                        input.name === "fecha_nombramiento" ||
                                        input.name === "fecha_afiliacion_eps" ||
                                        input.name === "barrio" ||
                                        input.name === "fecha_aplica_teletrabajo"
                                    ) {
                                        return (
                                            <TextField
                                                sx={{
                                                    width: "20rem",
                                                }}
                                                key={input.id}
                                                name={input.name}
                                                InputLabelProps={{
                                                    shrink: input.shrink,
                                                }}
                                                onChange={handleFormChange}
                                                value={formData[input.name] || ""}
                                                autoComplete="off"
                                                type={input.type}
                                                label={input.label}
                                            />
                                        );
                                    } else if (input.name === "observaciones") {
                                        return (
                                            <TextField
                                                sx={{
                                                    width: "100%",
                                                }}
                                                key={input.id}
                                                multiline
                                                rows={4}
                                                name={input.name}
                                                InputLabelProps={{
                                                    shrink: input.shrink,
                                                }}
                                                onChange={handleFormChange}
                                                value={formData[input.name] || ""}
                                                autoComplete="off"
                                                type={input.type}
                                                label={input.label}
                                            />
                                        );
                                    } else {
                                        return (
                                            <TextField
                                                sx={{
                                                    width: "20rem",
                                                }}
                                                key={input.id}
                                                required
                                                name={input.name}
                                                InputLabelProps={{
                                                    shrink: input.shrink,
                                                }}
                                                onChange={handleFormChange}
                                                value={formData[input.name] || ""}
                                                autoComplete="off"
                                                type={input.type}
                                                label={input.label}
                                            />
                                        );
                                    }
                                };

                                const renderInput = (input, formData, handleFormChange) => {
                                    if (input.type === "select") {
                                        return renderSelectInput(input, formData, handleFormChange);
                                    } else if (
                                        [
                                            "5",
                                            "antiguedad",
                                            "desempeño",
                                            "falta",
                                            "tipo_sancion",
                                            "sancion",
                                            "53",
                                            "54",
                                            "55",
                                            "56",
                                            "57",
                                            "58",
                                            "59",
                                            "60",
                                            "61",
                                            "fecha_nombramiento_legado",
                                            "cambio_campaña_legado",
                                            "cambio_eps_legado",
                                        ].includes(input.id)
                                    ) {
                                        return null;
                                    } else {
                                        return renderTextInput(input, formData, handleFormChange);
                                    }
                                };

                                function renderInputs(section, formData, handleFormChange) {
                                    return section.inputs.map((input) => renderInput(input, formData, handleFormChange));
                                }

                                const excludedTitles = ["Información de Vacaciones", "Información de Retiro", "Acciones Disciplinarias"];
                                if (excludedTitles.includes(section.title)) {
                                    return null;
                                }

                                return (
                                    <Box
                                        key={section.title}
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            width: "100%",
                                            gap: "30px",
                                            my: 2,
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
                                        {renderInputs(section, formData, handleFormChange)}
                                    </Box>
                                );
                            })}
                        </Box>
                    </List>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AddModal;
