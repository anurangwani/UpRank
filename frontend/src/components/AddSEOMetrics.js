import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import axios from "axios";

const AddSeoMetrics = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/seometrics", values, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success("SEO metrics added successfully!");
        } catch (error) {
            message.error("Error adding SEO metrics");
        }
        setLoading(false);
    };

    return (
        <Card title="Add SEO Metrics" style={{ maxWidth: 500, margin: "auto" }}>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Keyword" name="keyword" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Position" name="position" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="Search Volume" name="searchVolume" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="Backlink Count" name="backlinkCount" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="Domain Authority" name="domainAuthority" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>Add SEO Metrics</Button>
            </Form>
        </Card>
    );
};

export default AddSeoMetrics;
