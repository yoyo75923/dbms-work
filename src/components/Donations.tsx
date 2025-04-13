import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';

interface Donation {
    donation_id: number;
    donation_name: string;
    start_date: string;
    end_date: string;
    created_by: string;
    created_at: string;
}

const Donations: React.FC = () => {
    const { user } = useAuth();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const canCreate = user.role === 'mentor' || user.role === 'gen_sec';

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch('/api/donations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setDonations(data);
        } catch (error) {
            message.error('Failed to fetch donations');
        }
    };

    const handleCreate = async (values: any) => {
        try {
            await fetch('/api/donations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    donation_name: values.donation_name,
                    start_date: values.dates[0].format('YYYY-MM-DD'),
                    end_date: values.dates[1].format('YYYY-MM-DD')
                })
            });

            message.success('Donation campaign created successfully');
            setIsModalVisible(false);
            form.resetFields();
            fetchDonations();
        } catch (error) {
            message.error('Failed to create donation campaign');
        }
    };

    const columns: ColumnsType<Donation> = [
        {
            title: 'Donation Name',
            dataIndex: 'donation_name',
            key: 'donation_name',
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Created By',
            dataIndex: 'created_by',
            key: 'created_by',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleString()
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Donations</h1>
                {canCreate && (
                    <Button
                        type="primary"
                        onClick={() => setIsModalVisible(true)}
                    >
                        Create Donation Campaign
                    </Button>
                )}
            </div>

            <Table columns={columns} dataSource={donations} rowKey="donation_id" />

            <Modal
                title="Create Donation Campaign"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleCreate}
                    layout="vertical"
                >
                    <Form.Item
                        name="donation_name"
                        label="Donation Name"
                        rules={[{ required: true, message: 'Please enter donation name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="dates"
                        label="Campaign Duration"
                        rules={[{ required: true, message: 'Please select dates' }]}
                    >
                        <DatePicker.RangePicker />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create Campaign
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Donations; 