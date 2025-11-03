import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Card, notification } from "antd";

const AddAnalytics = () => {
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm(); // Ant Design form instance

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/analytics",
                {
                    pageUrl: values.pageUrl,
                    pageLoadTime: values.pageLoadTime,
                    ctr: values.ctr,
                    bounceRate: values.bounceRate
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            notification.success({
                message: "Success",
                description: "Analytics data added successfully!",
            });

            form.resetFields(); // Reset form after submission
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to add analytics data",
            });
        }
        setLoading(false);
    };

    return (
        <Card title="📊 Add Analytics Data" style={{ maxWidth: 500, margin: "auto", marginTop: 30 }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Page URL"
                    name="pageUrl"
                    rules={[{ required: true, message: "Please enter a valid URL" }]}
                >
                    <Input placeholder="Enter Page URL" />
                </Form.Item>

                <Form.Item
                    label="Page Load Time (seconds)"
                    name="pageLoadTime"
                    rules={[{ required: true, message: "Enter page load time" }]}
                >
                    <Input type="number" placeholder="Page Load Time" />
                </Form.Item>

                <Form.Item
                    label="Click-Through Rate (CTR %)"
                    name="ctr"
                    rules={[{ required: true, message: "Enter CTR percentage" }]}
                >
                    <Input type="number" placeholder="CTR (%)" />
                </Form.Item>

                <Form.Item
                    label="Bounce Rate (%)"
                    name="bounceRate"
                    rules={[{ required: true, message: "Enter bounce rate" }]}
                >
                    <Input type="number" placeholder="Bounce Rate (%)" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Submit Analytics Data
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddAnalytics;
