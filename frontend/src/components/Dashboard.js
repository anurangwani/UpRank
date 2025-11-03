import React, { useState, useEffect } from "react";
import { Card, Typography, Spin, Alert, Row, Col, Statistic, Table ,notification,Button} from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import axios from "axios";
import { CSVLink } from "react-csv"; // For CSV export
import * as XLSX from "xlsx"; // For Excel export
import { jsPDF } from "jspdf";
import { getSEOSuggestions } from "../utils/seoSuggestions";
import WebsiteForm from "./WebsiteForm";

const { Title } = Typography;



const Dashboard = () => 
    {
    const [seoData, setSeoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    
    const seoSuggestions = getSEOSuggestions(seoData);
    const [performanceHistory, setPerformanceHistory] = useState([]);
    const [url, setUrl] = useState("");
    const thresholds = {
        pageLoadTime: 3, // e.g., threshold for page load time in seconds
        bounceRate: 70, // e.g., threshold for bounce rate in percentage
        domainAuthority: 30 // e.g., threshold for domain authority
    };
    const fetchSeoMetrics = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/seo?url=${encodeURIComponent(url)}`);
            setSeoData(response.data);
        } catch (error) {
            console.error("Error fetching SEO data:", error);
        }
    };
    useEffect(() => {
        const fetchSeoAndAnalyticsData = async () => 
            {
            try 
            {
                const token = localStorage.getItem("token");

                // Fetch SEO Metrics
                const seoResponse = await axios.get("http://localhost:5000/api/seometrics", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (seoResponse.data && Array.isArray(seoResponse.data)) {
                    setSeoData(seoResponse.data);
                } else if (seoResponse.data && seoResponse.data.data) {
                    setSeoData([seoResponse.data.data]);
                }

                // Fetch Analytics Data
                const analyticsResponse = await axios.get("http://localhost:5000/api/analytics", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (analyticsResponse.data && Array.isArray(analyticsResponse.data)) {
                    setAnalyticsData(analyticsResponse.data);
                } else if (analyticsResponse.data && analyticsResponse.data.data) {
                    setAnalyticsData([analyticsResponse.data.data]);
                }
                

                // Fetch Performance History
                const historyResponse = await axios.get("http://localhost:5000/api/performance/history", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
    
                console.log("Performance History Data:", historyResponse.data); // Log to check data
    
                if (historyResponse.data && Array.isArray(historyResponse.data)) {
                    setPerformanceHistory(historyResponse.data);
                } else if (historyResponse.data && historyResponse.data.data) {
                    setPerformanceHistory([historyResponse.data.data]);
                }
    
                setLoading(false);
                checkForAlerts(seoResponse.data, analyticsResponse.data);

                
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        

        fetchSeoAndAnalyticsData();
        
    }, []);
    const chartData = performanceHistory.map(entry => ({
        date: new Date(entry.date).toLocaleDateString(),
        bounceRate: entry.seoMetrics.bounceRate,
        pageLoadTime: entry.seoMetrics.pageLoadTime,
    }));

    const checkForAlerts = (seoData, analyticsData) => {
        const newAlerts = [];

        // Loop through SEO data and check for domain authority threshold breach
        seoData.forEach((item) => {
            if (item.domainAuthority < thresholds.domainAuthority) {
                newAlerts.push(`Alert: Domain Authority for "${item.keyword}" is below threshold!`);
            }
        });

        // Loop through Analytics data and check for page load time and bounce rate threshold breaches
        analyticsData.forEach((item) => {
            if (item.pageLoadTime > thresholds.pageLoadTime) {
                newAlerts.push(`Alert: Page Load Time for "${item.pageUrl}" exceeds threshold!`);
            }
            if (item.bounceRate > thresholds.bounceRate) {
                newAlerts.push(`Alert: Bounce Rate for "${item.pageUrl}" exceeds threshold!`);
            }
        });

        // If there are new alerts, show them
        if (newAlerts.length > 0) {
            setAlerts(newAlerts);
            newAlerts.forEach((alert) => {
                notification.warning({
                    message: "SEO Alert",
                    description: alert,
                    duration: 5
                });
            });
        }
    };

    // Table Columns for SEO Data
    const columns = [
        { title: "Keyword", dataIndex: "keyword", key: "keyword" },
        { title: "Position", dataIndex: "position", key: "position" },
        { title: "Search Volume", dataIndex: "searchVolume", key: "searchVolume" },
        { title: "Backlinks", dataIndex: "backlinkCount", key: "backlinkCount" },
        { title: "Domain Authority", dataIndex: "domainAuthority", key: "domainAuthority" }
    ];

    const exportToCSV = () => {
        const csvData = seoData.map((item) => ({
            Keyword: item.keyword,
            Position: item.position,
            "Search Volume": item.searchVolume,
            "Backlinks": item.backlinkCount,
            "Domain Authority": item.domainAuthority
        }));
        return csvData;
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(seoData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SEO Data");
        XLSX.writeFile(wb, "SEO_Report.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        let yOffset = 10;

        // Add title
        doc.setFontSize(16);
        doc.text("SEO Data Report", 10, yOffset);
        yOffset += 10;

        // Add table headers
        doc.setFontSize(12);
        const headers = ["Keyword", "Position", "Search Volume", "Backlinks", "Domain Authority"];
        doc.text(headers.join("  "), 10, yOffset);
        yOffset += 10;

        // Add table rows
        seoData.forEach((item) => {
            const row = [
                item.keyword,
                item.position,
                item.searchVolume,
                item.backlinkCount,
                item.domainAuthority
            ];
            doc.text(row.join("  "), 10, yOffset);
            yOffset += 10;
        });

        // Save the PDF
        doc.save("SEO_Report.pdf");
    };

    // Sample Comparative Data (e.g., Week-on-Week)
    const comparativeData = seoData.map((item, index) => ({
        name: `Week ${index + 1}`,
        traffic: item.searchVolume, // Replace with actual traffic data
        bounceRate: analyticsData[index]?.bounceRate || 0, // Replace with bounce rate
        conversions: analyticsData[index]?.ctr || 0 // Replace with conversions (CTR)
    }));

    return (
        <Card style={{ margin: "20px", padding: "20px", borderRadius: "10px", background: "#f5f5f5" }}>
            <Title level={2} style={{ textAlign: "center" }}>📊 SEO Metrics & Analytics Dashboard</Title>

        {
            loading ? (
                <Spin tip="Loading data..." size="large" style={{ display: "flex", justifyContent: "center", marginTop: 20 }} />
            ) : seoData.length > 0 ? (
                <>
                        
                
                {alerts.length > 0 && (
                        <Card title="🔔 Recent Alerts" style={{ marginBottom: "20px" }}>
                            {alerts.map((alert, index) => (
                                <Alert key={index} message={alert} type="warning" showIcon />
                            ))}
                        </Card>
                        
                    )}
                        <div>
            <h2>SEO Performance History</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bounceRate" stroke="#75c3c3" />
                    <Line type="monotone" dataKey="pageLoadTime" stroke="#9966ff" />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div>
            <h1>SEO Metrics</h1>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter Website URL" />
            <button onClick={fetchSeoMetrics}>Get SEO Data</button>

            {seoData && (
                <div>
                    <h2>Results for {seoData.url}</h2>
                    <p>Page Speed Score: {seoData.pageSpeedScore|| null}</p>
                    <p>CTR: {seoData.ctr|| null}%</p>
                    <p>Bounce Rate: {seoData.bounceRate|| null}%</p>
                </div>
            )}
        </div>

                    {/* Key Statistics Section */}
                    <Row gutter={16} style={{ marginBottom: "20px" }}>
                    
                        <Col span={6}>
                            <Card>
                                <Statistic title="Total Keywords" value={seoData.length} />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic 
                                    title="Avg. Position"
                                    value={(
                                        seoData.reduce((sum, item) => sum + Number(item.position), 0) / seoData.length
                                    ).toFixed(2)} 
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic title="Avg. Domain Authority" 
                                    value={(
                                        seoData.reduce((sum, item) => sum + Number(item.domainAuthority), 0) / seoData.length
                                    ).toFixed(2)}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic title="Total Backlinks" 
                                    value={seoData.reduce((sum, item) => sum + Number(item.backlinkCount), 0)} 
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* SEO Performance Chart */}
                    <Card title="📈 SEO Performance Trends" style={{ marginBottom: "20px" }}>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={seoData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="searchVolume" stroke="#8884d8" />
                                <Line type="monotone" dataKey="backlinkCount" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Comparative Data (Week-on-Week) */}
                    <Card title="📊 Comparative Analysis (Week-on-Week)" style={{ marginBottom: "20px" }}>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={comparativeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="traffic" stroke="#8884d8" />
                                <Line type="monotone" dataKey="bounceRate" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Bar Chart for Keyword Performance */}
                    <Card title="📊 Keyword Performance (Bar Chart)" style={{ marginBottom: "20px" }}>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={seoData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="keyword" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="searchVolume" fill="#8884d8" />
                                <Bar dataKey="backlinkCount" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Pie Chart for Traffic Distribution */}
                    <Card title="📊 Traffic Distribution (Pie Chart)" style={{ marginBottom: "20px" }}>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie data={comparativeData} dataKey="traffic" nameKey="name" outerRadius={80} fill="#8884d8" label>
                                    {comparativeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Area Chart for Conversions & Bounce Rate */}
                    <Card title="📊 Conversions and Bounce Rate (Area Chart)" style={{ marginBottom: "20px" }}>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={comparativeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="conversions" fill="#8884d8" stroke="#8884d8" />
                                <Area type="monotone" dataKey="bounceRate" fill="#82ca9d" stroke="#82ca9d" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* SEO Data Table */}
                    <Card title="📌 SEO Data Overview">
                        <Table dataSource={seoData} columns={columns} rowKey="keyword" pagination={{ pageSize: 5 }} />
                    </Card>

                    {/* Analytics Data Section */}
                    {analyticsData.length > 0 ? (
                        <Card title="📊 Additional Analytics Insights" style={{ marginTop: "20px" }}>
                            <Table
                                dataSource={analyticsData}
                                columns={[
                                    { title: "Page URL", dataIndex: "pageUrl", key: "pageUrl" },
                                    { title: "Load Time (s)", dataIndex: "pageLoadTime", key: "pageLoadTime" },
                                    { title: "CTR (%)", dataIndex: "ctr", key: "ctr" },
                                    { title: "Bounce Rate (%)", dataIndex: "bounceRate", key: "bounceRate" }
                                ]}
                                rowKey="pageUrl"
                                pagination={{ pageSize: 5 }}
                            />
                        </Card>
                    ) : (
                        <Alert message="No Analytics Data Available" type="info" showIcon />
                    )}
                    <Card style={{ marginBottom: "20px", padding: "20px" }} title="📤 Export Data">
                <Row gutter={16} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <Button type="primary">
                                <CSVLink data={exportToCSV()} filename="SEO_Report.csv" style={{ color: "#fff" }}>
                                    Export to CSV
                                </CSVLink>
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Button type="primary" onClick={exportToExcel}>
                                Export to Excel
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Button type="primary" onClick={exportToPDF}>
                                Export to PDF
                            </Button>
                        </Col>
                    </Row>
                </Card>
                </>
            ) : (
                <Alert message="No SEO Data available" type="warning" showIcon />
            )
        }
        </Card>
    );
};

export default Dashboard;
