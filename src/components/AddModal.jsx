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
import * as Yup from "yup";
import { Formik, Form, Field, useField, useFormikContext } from "formik";
import { arrayDataAdd } from "../assets/arrayDataAdd.js";
import { fieldToTextField, Select as FormikSelect } from "formik-material-ui";

const AddModal = ({ arrayData, openModalAdd, formData, setFormData, setOpenModalAdd, setProgressBar, searchEmployeesUpdate, stylesModal, setShowSnackAlert }) => {
    const validationSchema = Yup.object().shape({
        // Define your validation rules here for each form field
        // Example:
        cedula: Yup.string().required("Cedula is required"),
        // nombre: Yup.string().required("Nombre is required"),
        // tipo_documento: Yup.string().required("Tipo de documento is required"),
        // fecha_nacimiento: Yup.date().required("Fecha de nacimiento is required"),
        // lugar_expedicion: Yup.string().required("Lugar de expedición is required"),
        // fecha_expedicion: Yup.date().required("Fecha de expedición is required"),
        // genero: Yup.string().required("Género is required"),
        // rh: Yup.string().required("RH is required"),
        // estado_civil: Yup.string().required("Estado civil is required"),
        // hijos: Yup.number().required("Hijos is required"),
        // personas_a_cargo: Yup.number().required("Personas a cargo is required"),
        // estrato: Yup.number().required("Estrato is required"),
        // celular: Yup.string().required("Celular is required"),
        // correo: Yup.string().email("Invalid email address").required("Correo is required"),
        // direccion: Yup.string().required("Dirección is required"),
        // localidad: Yup.string().required("Localidad is required"),
        // tel_contacto: Yup.string().required("Teléfono de contacto is required"),
        // nivel_escolaridad: Yup.string().required("Nivel de escolaridad is required"),
        // cuenta_nomina: Yup.string().required("Cuenta de nomina is required"),
        // sede: Yup.string().required("Sede is required"),
        // cargo: Yup.string().required("Cargo is required"),
        // gerencia: Yup.string().required("Gerencia is required"),
        // campana_general: Yup.string().required("Campana general is required"),
        // area_negocio: Yup.string().required("Area de negocio is required"),
        // tipo_contrato: Yup.string().required("Tipo de contrato is required"),
        // fecha_ingreso: Yup.date().required("Fecha de ingreso is required"),
        // salario: Yup.number().required("Salario is required"),
        // observaciones: Yup.string().required("Observaciones is required"),
        // Add more fields as needed
    });

    const initialValues = {
        cedula: "",
        nombre: "",
        tipo_documento: "",
        fecha_nacimiento: null,
        lugar_expedicion: "",
        fecha_expedicion: null,
        genero: "",
        rh: "",
        estado_civil: "",
        hijos: "",
        personas_a_cargo: "",
        estrato: "",
        tel_fijo: "",
        celular: "", 
        correo: "",
        correo_corporativo: "",
        direccion: "",
        barrio: "",
        localidad: "",
        contacto_emergencia: "",
        parentesco: "",
        tel_contacto: "",
        nivel_escolaridad: "",
        profesion: "",
        estudios_en_curso: "",
        fecha_afiliacion_eps: null,
        eps: "",
        cambio_eps_legado: "",
        pension: "",
        caja_compensacion: "",
        cesantias: "",
        cuenta_nomina: "",
        sede: "",
        cargo: "",
        fecha_nombramiento: null,
        gerencia: "",
        campana_general: "",
        area_negocio: "",
        tipo_contrato: "",
        fecha_ingreso: null,
        salario: "",
        subsidio_transporte: "",
        aplica_teletrabajo: "",
        fecha_aplica_teletrabajo: null,
        talla_camisa: "",
        talla_pantalon: "",
        talla_zapatos: "",
        observaciones: "",
    };

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
                setShowSnackAlert("error", "Por favor envía este error a desarrollo: " + error, true);
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

    const FormikTextField = ({ label, type, options, multiline, rows, width, ...props }) => {
        const [field, meta] = useField(props);
        const errorText = meta.error && meta.touched ? meta.error : "";
        if (type === "select") {
            return (
                <TextField sx={{ width: "330px" }} defaultValue="" select type={type} label={label} {...field} helperText={errorText} error={!!errorText}>
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            );
        } else {
            return <TextField sx={{ width: width }} multiline={multiline} rows={rows} type={type} label={label} {...field} helperText={errorText} error={!!errorText} />;
        }
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
                <Box sx={stylesModal}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mx: "10px",
                        }}
                    >
                        <Button type="submit" form="formik">
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
                        <Formik
                            initialValues={arrayDataAdd.reduce((values, section) => {
                                section.inputs.forEach((input) => {
                                    values[input.name] = input.initialValue;
                                });
                                return values;
                            }, {})}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                await new Promise((r) => setTimeout(r, 500));
                                alert(JSON.stringify(values, null, 2));
                            }}
                        >
                            {() => (
                                <Form id="formik">
                                    {arrayDataAdd.map((section) => (
                                        <Box key={section.title}>
                                            <legend style={{ margin: "1.5rem 0rem" }}>{section.title}</legend>
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                {section.inputs.map((input) =>
                                                    input.type === "select" ? (
                                                        <Field
                                                            sx={{ width: "320px" }}
                                                            key={input.name}
                                                            name={input.name}
                                                            label={input.label}
                                                            component={FormikSelect}
                                                            variant="outlined"
                                                        >
                                                            {input.options.map((option, index) => (
                                                                <MenuItem key={index} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Field>
                                                    ) : input.type === "date" ? (
                                                        <Field
                                                            key={input.name}
                                                            name={input.name}
                                                            type={input.type}
                                                            InputLabelProps={{
                                                                shrink: input.shrink,
                                                            }}
                                                            component={TextField}
                                                            label={input.label}
                                                            variant="outlined"
                                                            sx={{ width: "320px" }}
                                                        />
                                                    ) : (
                                                        <Field
                                                            key={input.name}
                                                            name={input.name}
                                                            type={input.type}
                                                            component={TextField}
                                                            label={input.label}
                                                            variant="outlined"
                                                            sx={{ width: "320px" }}
                                                        />
                                                    )
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Form>
                            )}
                        </Formik>
                    </List>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AddModal;
