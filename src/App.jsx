// Import the material-ui components
import LoginView from "./Components/LoginView";
import HomeView from "./Components/HomeView";
import PermissionsView from "./Components/PermissionsView";
import SingUpView from "./Components/SingUpView";
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
