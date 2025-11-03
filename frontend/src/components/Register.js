import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Card, notification, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Link } = Typography;

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/users/register', values);
            notification.success({
                message: 'Registration Successful',
                description: 'You can now log in with your credentials!',
            });
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            notification.error({
                message: 'Registration Failed',
                description: error.response?.data.message || 'Something went wrong!',
            });
        }
        setLoading(false);
    };

    return (
        <Row justify="center" align="middle" style={{ height: '100vh' }}>
            <Col xs={24} sm={12} md={8}>
                <Card title="Register" bordered={false} style={{ width: '100%' }}>
                    <Form
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ name, email, password }}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter your name!' }]}
                        >
                            <Input
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Item>

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
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                    <Row justify="center">
                        <Col>
                            <Link onClick={() => navigate('/login')}>Already have an account? Login here.</Link>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default Register;
