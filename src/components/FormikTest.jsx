import React from "react";
import { arrayDataAdd } from "../assets/arrayDataAdd.js";
import Box from "@mui/material/Box";
import { Formik, Form, Field, useField, FastField, useFormikContext } from "formik";
import { fieldToTextField, Select as FormikSelect, TextField } from "formik-material-ui";
import MenuItem from "@mui/material/MenuItem";

const FormikTest = () => {
    const handleSubmit = (values) => {
        console.log(values);
        // alert(JSON.stringify(values, null, 2));
    };

    return (
        <Formik
            initialValues={arrayDataAdd.reduce((values, section) => {
                section.inputs.forEach((input) => {
                    values[input.name] = input.initialValue;
                });
                return values;
            }, {})}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {() => (
                <Form id="formik">
                    {arrayDataAdd.map((section) => (
                        <Box key={section.title}>
                            <legend style={{ margin: "1.5rem 0rem" }}>{section.title}</legend>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                {section.inputs.map((input) =>
                                    input.type === "select" ? (
                                        <Field sx={{ width: "320px" }} key={input.name} name={input.name} label={input.label} component={FormikSelect} variant="outlined">
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
                                        <FastField key={input.name} name={input.name} type={input.type} label={input.label} variant="outlined" sx={{ width: "320px" }} />
                                    )
                                )}
                            </Box>
                        </Box>
                    ))}
                </Form>
            )}
        </Formik>
    );
};

export default FormikTest;
