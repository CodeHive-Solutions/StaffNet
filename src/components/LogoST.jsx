import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button"

const reload = () => {

}

const LogoST = ({ styles }) => {
    return (
        <Box style={{cursor: "pointer"}} onClick={() => { window.location.reload(true)}}>
            <p style={styles}>
                Staff
                <span>
                    <b>Net</b>
                </span>
            </p>
        </Box>
    );
};

const defaultStyles = {
    letterSpacing: "9px",
    fontSize: "2em",
    margin: "0%",
    borderTop: "solid 0.15rem",
    borderBottom: "solid .15rem",
};

export default function CustomLogoST({ styles = defaultStyles }) {
    return <LogoST styles={styles} />;
}
