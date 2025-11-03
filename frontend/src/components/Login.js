import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Card, notification, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Link } = Typography;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', values);
            const token = response.data.token;
            localStorage.setItem('token', token); // Store token in localStorage
            notification.success({
                message: 'Login Successful',
                description: 'You are now logged in!',
            });
            navigate('/dashboard'); // Redirect to the dashboard
        } catch (error) {
            notification.error({
                message: 'Login Failed',
                description: error.response?.data.message || 'Something went wrong!',
            });
        }
        setLoading(false);
    };

    return (
        <Row justify="center" align="middle" style={{ height: '100vh' }}>
            <Col xs={24} sm={12} md={8}>
                <Card title="Login" bordered={false} style={{ width: '100%' }}>
                    <Form
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ email, password }}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please enter your email!' }]}
                        >
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input.Password
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Row justify="center">
                        <Col>
                            <Link onClick={() => navigate('/register')}>Don't have an account? Register here.</Link>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default Login;
