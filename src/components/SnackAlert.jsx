import React from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const SnackAlert = ({ open, close, severity, message, handleViewChange, viewChange }) => {

    if (viewChange !== undefined) {
        handleViewChange = handleViewChange.handleViewChange
        return (
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                onClose={close}
            >
                <Alert
                    severity={severity}
                    onClose={close}
                    sx={{ width: "100%" }}
                >
                    {message}
                    <Box sx={{ display: "flex", justifyContent: "center", mt: "5px" }}>
                        <Button color="inherit" onClick={() => handleViewChange(viewChange)}>
                            {messageButton}
                        </Button>
                    </Box>
                </Alert>
            </Snackbar>
        )
    } else {
        return (
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                autoHideDuration={6000}
                onClose={close}
            >
                <Alert
                    onClose={close}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        );
    }
};


export default SnackAlert;
