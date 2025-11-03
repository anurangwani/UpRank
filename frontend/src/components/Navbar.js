import React, { useState } from "react";
import { Menu, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const closeDrawer = () => {
        setVisible(false);
    };

    return (
        <nav style={{ background: "#001529", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link to="/" style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>UpRank</Link>

            <div className="desktop-menu">
                <Menu theme="dark" mode="horizontal" style={{ background: "transparent" }}>
                    <Menu.Item key="dashboard">
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="analytics">
                        <Link to="/analytics">Analytics</Link>
                    </Menu.Item>
                    <Menu.Item key="seo-metrics">
                        <Link to="/seo-metrics">SEO Metrics</Link>
                    </Menu.Item>
                    <Menu.Item key="login">
                        <Link to="/login">Login</Link>
                    </Menu.Item>
                </Menu>
            </div>

            {/* Hamburger Menu for Mobile */}
            <Button type="primary" icon={<MenuOutlined />} onClick={showDrawer} className="mobile-menu-button" />

            <Drawer title="Menu" placement="right" onClose={closeDrawer} visible={visible}>
                <Menu mode="vertical">
                    <Menu.Item key="dashboard">
                        <Link to="/dashboard" onClick={closeDrawer}>Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="analytics">
                        <Link to="/analytics" onClick={closeDrawer}>Analytics</Link>
                    </Menu.Item>
                    <Menu.Item key="seo-metrics">
                        <Link to="/seo-metrics" onClick={closeDrawer}>SEO Metrics</Link>
                    </Menu.Item>
                    <Menu.Item key="login">
                        <Link to="/login" onClick={closeDrawer}>Login</Link>
                    </Menu.Item>
                </Menu>
            </Drawer>
        </nav>
    );
};

export default Navbar;
