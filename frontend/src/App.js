import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/AddAnaytics";
import AddSeoMetrics from "./components/AddSEOMetrics";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
    return (
        <Router>
            <Navbar />
            <div style={{ padding: "20px" }}>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/seo-metrics" element={<AddSeoMetrics />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Login />} />  {/* Default Route */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
