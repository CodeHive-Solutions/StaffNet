// Importa los componentes necesarios de React y MUI
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
// Define tu componente de dirección
const AddressForm = ({ handleFormChange }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [option1Value, setOption1Value] = useState("");
    const [option2Value, setOption2Value] = useState("");
    const [option3Value, setOption3Value] = useState("");

    const concatenatedValue = `${selectedOption ? selectedOption.value : ""} ${option1Value} ${option2Value} ${option3Value}`;

    const options = [
        { value: "AD", label: "Administración" },
        { value: "AG", label: "Agencia" },
        { value: "AGP", label: "Agrupación" },
        { value: "ALM", label: "Almacen" },
        { value: "AL", label: "Altillo" },
        { value: "APTDO", label: "Apartado" },
        { value: "AP", label: "Apartamento" },
        { value: "AUT", label: "Autopista" },
        { value: "AV", label: "Avenida" },
        { value: "AK", label: "Avenida Carrera" },
        { value: "BRR", label: "Barrio" },
        { value: "BL", label: "Bloque" },
        { value: "BG", label: "Bodega" },
        { value: "BLV", label: "Boulevar" },
        { value: "CL", label: "Calle" },
        { value: "CN", label: "Camino" },
        { value: "CR", label: "Carrera" },
        { value: "CARR", label: "Carretera" },
        { value: "CA", label: "Casa" },
        { value: "CEL", label: "Celula" },
        { value: "CC", label: "Centro Comercial" },
        { value: "CIR", label: "Circular" },
        { value: "CRV", label: "Circunvalar" },
        { value: "CD", label: "Ciudadela" },
        { value: "CONJ", label: "Conjunto" },
        { value: "CON", label: "Conjunto Residencial" },
        { value: "RES", label: "Residencial" },
        { value: "CS", label: "Consultorio" },
        { value: "CORR", label: "Corregimiento" },
        { value: "DPTO", label: "Departamento" },
        { value: "DP", label: "Deposito" },
        { value: "DS", label: "Deposito Sotano" },
        { value: "DG", label: "Diagonal" },
        { value: "ED", label: "Edificio" },
        { value: "EN", label: "Entrada" },
        { value: "ESQ", label: "Esquina" },
        { value: "ESTE", label: "Este" },
        { value: "ET", label: "Etapa" },
        { value: "EX", label: "Exterior" },
        { value: "FCA", label: "Finca" },
        { value: "GJ", label: "Garaje" },
        { value: "GS", label: "Garaje Sotano" },
        { value: "HC", label: "Hacienda" },
        { value: "IN", label: "Interior" },
        { value: "KM", label: "Kilometro" },
        { value: "LC", label: "Local" },
        { value: "LM", label: "Local Mezzanine" },
        { value: "LT", label: "Lote" },
        { value: "MZ", label: "Manzana" },
        { value: "MN", label: "Mezzanine" },
        { value: "MD", label: "Modulo" },
        { value: "MCP", label: "Municipio" },
        { value: "NORTE", label: "Norte" },
        { value: "OCC", label: "Occidente" },
        { value: "OESTE", label: "Oeste" },
        { value: "OF", label: "Oficina" },
        { value: "O", label: "Oriente" },
        { value: "PA", label: "Parcela" },
        { value: "PAR", label: "Parque" },
        { value: "PQ", label: "Parqueadero" },
        { value: "PJ", label: "Pasaje" },
        { value: "PS", label: "Paseo" },
        { value: "PH", label: "Penthouse" },
        { value: "P", label: "Piso" },
        { value: "PL", label: "Planta" },
        { value: "POR", label: "Porteria" },
        { value: "PD", label: "Predio" },
        { value: "PN", label: "Puente" },
        { value: "PT", label: "Puesto" },
        { value: "SA", label: "Salón" },
        { value: "SC", label: "Salón Comunal" },
        { value: "SEC", label: "Sector" },
        { value: "SS", label: "Semisotano" },
        { value: "SL", label: "Solar" },
        { value: "ST", label: "Sotano" },
        { value: "SU", label: "Suite" },
        { value: "SM", label: "Supermanzana" },
        { value: "SUR", label: "Sur" },
        { value: "TER", label: "Terminal" },
        { value: "TZ", label: "Terraza" },
        { value: "TO", label: "Torre" },
        { value: "TV", label: "Transversal" },
        { value: "UN", label: "Unidad" },
        { value: "UR", label: "Unidad Residencial" },
        { value: "URB", label: "Urbanización" },
        { value: "VTE", label: "Variante" },
        { value: "VDA", label: "Vereda" },
        { value: "ZN", label: "Zona" },
        { value: "ZF", label: "Zona Franca" },
        { value: "#", label: "#" },
        { value: "-", label: "-" },
    ];

    const handleOptionChange = (event, newValue) => {
        setSelectedOption(newValue);
        let concatenatedValue = `${newValue ? newValue.value : ""} ${option1Value} ${option2Value} ${option3Value}`;
        const eventDirection = { target: { value: concatenatedValue, name: "direction" } };
        handleFormChange(eventDirection);
    };

    const handleOption1Change = (event) => {
        setOption1Value(event.target.value);
        let concatenatedValue = `${selectedOption ? selectedOption.value : ""} ${event.target.value} ${option2Value} ${option3Value}`;
        const eventDirection = { target: { value: concatenatedValue, name: "direction" } };
        handleFormChange(eventDirection);
    };

    const handleOption2Change = (event) => {
        setOption2Value(event.target.value);
        let concatenatedValue = `${selectedOption ? selectedOption.value : ""} ${option1Value} ${event.target.value} ${option3Value}`;
        const eventDirection = { target: { value: concatenatedValue, name: "direction" } };
        handleFormChange(eventDirection);
    };

    const handleOption3Change = (event) => {
        setOption3Value(event.target.value);
        let concatenatedValue = `${selectedOption ? selectedOption.value : ""} ${option1Value} ${option2Value} ${event.target.value}`;
        const eventDirection = { target: { value: concatenatedValue, name: "direction" } };
        handleFormChange(eventDirection);
    };

    return (
        <>
            <Autocomplete
                isOptionEqualToValue={(option, value) => option.value === value.value}
                disablePortal
                id="directions-textfield"
                options={options}
                sx={{ width: "20rem" }}
                onChange={handleOptionChange}
                renderInput={(params) => <TextField required {...params} label="Dirección" />}
            />
            <TextField required onChange={handleOption1Change} label={"Opción 1"} sx={{ width: "20rem" }} />
            <TextField required onChange={handleOption2Change} label={"Opción 2"} sx={{ width: "20rem" }} />
            <TextField required onChange={handleOption3Change} label={"Opción 3"} sx={{ width: "20rem" }} />
            <Box>
                <TextField sx={{ width: "20rem" }} name="direccion" value={concatenatedValue} onChange={handleFormChange} label={"Dirección Formato Dian"} />
            </Box>
        </>
    );
};

// Exporta tu componente
export default AddressForm;
