// Import the material-ui components
import LoginView from "./components/LoginView";
import HomeView from "./components/HomeView";
import PermissionsView from "./components/PermissionsView";
import SingUpView from "./components/SingUpView";
import { useState } from "react";

// Create a theme for the UI design

const App = () => {
    const [currentView, setCurrentView] = useState("LoginView");

    const handleViewChange = (view) => {
        setCurrentView(view);
    };
    return (
        <div>
            {currentView === "LoginView" && (
                <LoginView handleViewChange={handleViewChange} />
            )}
            {currentView === "HomeView" && (
                <HomeView handleViewChange={handleViewChange} />
            )}
            {currentView === "PermissionsView" && (
                <PermissionsView handleViewChange={handleViewChange} />
            )}
            {currentView === "SingUpView" && (
                <SingUpView handleViewChange={handleViewChange} />
            )}
        </div>
    );
};
export default App;
