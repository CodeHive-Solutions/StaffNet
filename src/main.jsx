import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PermissionsView from "./Components/PermissionsView";
import HomeView from "./Components/HomeView";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoginView from "./Components/LoginView";
import SingUpView from "./Components/SingUpView";
const theme = createTheme({
    typography: {
        fontFamily: '"Open Sans", sans-serif',
    },
    // any other styles you want to apply
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
        path: "singUp",
        element: <SingUpView />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline>
            <RouterProvider router={router} />
        </CssBaseline>
    </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
