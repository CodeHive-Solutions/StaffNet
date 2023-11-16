import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PermissionsView from "./components/PermissionsView";
import HomeView from "./components/HomeView";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoginView from "./components/LoginView";
import DirectionField from "./components/DirectionField";
import Test from "./components/Test";
import FormikTest from "./components/FormikTest";

const theme = createTheme({
    typography: {
        fontFamily: '"Inter", sans-serif',
    },
});

const router = createBrowserRouter([
    {
        path: "*",
        element: <LoginView />,
    },
    {
        path: "home",
        element: <HomeView />,
    },
    {
        path: "permissions",
        element: <PermissionsView />,
    },
    {
        path: "test",
        element: <Test />,
    },
    {
        path: "formik-test",
        element: <FormikTest />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <RouterProvider router={router} />
            </CssBaseline>
        </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
