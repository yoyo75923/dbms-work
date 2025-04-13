import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Table, Modal, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../contexts/AuthContext';

interface Volunteer {
    volunteer_id: number;
    name: string;
    roll_number: string;
    wing_name: string;
}

interface Event {
    event_id: number;
    event_name: string;
    event_date: string;
    duration_hours: number;
}

const MentorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedVolunteers, setSelectedVolunteers] = useState<number[]>([]);
    const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
    const [isModifyingHours, setIsModifyingHours] = useState(false);
    const [modifyHoursData, setModifyHoursData] = useState({
        volunteerId: 0,
        eventId: 0,
        newHours: 0,
        reason: ''
    });

    useEffect(() => {
        fetchVolunteers();
        fetchActiveEvents();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const response = await fetch('/api/attendance/mentor-volunteers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setVolunteers(data);
        } catch (error) {
            message.error('Failed to fetch volunteers');
        }
    };

    const fetchActiveEvents = async () => {
        try {
            const response = await fetch('/api/events/active', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            message.error('Failed to fetch events');
        }
    };

    const handleMarkAttendance = async () => {
        if (!selectedEvent) {
            message.error('Please select an event');
            return;
        }

        try {
            const attendanceRecords = volunteers.map(volunteer => ({
                volunteerId: volunteer.volunteer_id,
                isPresent: selectedVolunteers.includes(volunteer.volunteer_id)
            }));

            await fetch('/api/attendance/mark-bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    eventId: selectedEvent.event_id,
                    attendanceRecords
                })
            });

            message.success('Attendance marked successfully');
            setIsMarkingAttendance(false);
            setSelectedVolunteers([]);
            setSelectedEvent(null);
        } catch (error) {
            message.error('Failed to mark attendance');
        }
    };

    const handleModifyHours = async () => {
        try {
            await fetch('/api/attendance/modify-hours', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(modifyHoursData)
            });

            message.success('Hours modified successfully');
            setIsModifyingHours(false);
            setModifyHoursData({ volunteerId: 0, eventId: 0, newHours: 0, reason: '' });
        } catch (error) {
            message.error('Failed to modify hours');
        }
    };

    const columns: ColumnsType<Volunteer> = [
        {
            title: 'Select',
            key: 'select',
            render: (_, record) => (
                <Checkbox
                    checked={selectedVolunteers.includes(record.volunteer_id)}
                    onChange={e => {
                        if (e.target.checked) {
                            setSelectedVolunteers([...selectedVolunteers, record.volunteer_id]);
                        } else {
                            setSelectedVolunteers(selectedVolunteers.filter(id => id !== record.volunteer_id));
                        }
                    }}
                />
            )
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Roll Number', dataIndex: 'roll_number', key: 'roll_number' },
        { title: 'Wing', dataIndex: 'wing_name', key: 'wing_name' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button onClick={() => {
                    setModifyHoursData({ ...modifyHoursData, volunteerId: record.volunteer_id });
                    setIsModifyingHours(true);
                }}>
                    Modify Hours
                </Button>
            )
        }
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Mentor Dashboard</h1>

            <div className="mb-6">
                <Button
                    type="primary"
                    onClick={() => setIsMarkingAttendance(true)}
                    className="mr-4"
                >
                    Mark Attendance
                </Button>
            </div>

            <Table columns={columns} dataSource={volunteers} rowKey="volunteer_id" />

            {/* Mark Attendance Modal */}
            <Modal
                title="Mark Attendance"
                open={isMarkingAttendance}
                onOk={handleMarkAttendance}
                onCancel={() => {
                    setIsMarkingAttendance(false);
                    setSelectedVolunteers([]);
                    setSelectedEvent(null);
                }}
            >
                <div className="mb-4">
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedEvent?.event_id || ''}
                        onChange={e => {
                            const event = events.find(ev => ev.event_id === Number(e.target.value));
                            setSelectedEvent(event || null);
                        }}
                    >
                        <option value="">Select Event</option>
                        {events.map(event => (
                            <option key={event.event_id} value={event.event_id}>
                                {event.event_name} ({event.event_date})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <Button onClick={() => setSelectedVolunteers(volunteers.map(v => v.volunteer_id))}>
                        Mark All Present
                    </Button>
                    <Button onClick={() => setSelectedVolunteers([])} className="ml-2">
                        Mark All Absent
                    </Button>
                </div>

                <Table
                    columns={columns.filter(col => col.key !== 'actions')}
                    dataSource={volunteers}
                    rowKey="volunteer_id"
                    pagination={false}
                />
            </Modal>

            {/* Modify Hours Modal */}
            <Modal
                title="Modify Hours"
                open={isModifyingHours}
                onOk={handleModifyHours}
                onCancel={() => {
                    setIsModifyingHours(false);
                    setModifyHoursData({ volunteerId: 0, eventId: 0, newHours: 0, reason: '' });
                }}
            >
                <div className="mb-4">
                    <select
                        className="w-full p-2 border rounded mb-4"
                        value={modifyHoursData.eventId}
                        onChange={e => setModifyHoursData({ ...modifyHoursData, eventId: Number(e.target.value) })}
                    >
                        <option value="">Select Event</option>
                        {events.map(event => (
                            <option key={event.event_id} value={event.event_id}>
                                {event.event_name} ({event.event_date})
                            </option>
                        ))}
                    </select>

                    <Input
                        type="number"
                        placeholder="New Hours"
                        className="mb-4"
                        value={modifyHoursData.newHours}
                        onChange={e => setModifyHoursData({ ...modifyHoursData, newHours: Number(e.target.value) })}
                    />

                    <Input.TextArea
                        placeholder="Reason for modification"
                        value={modifyHoursData.reason}
                        onChange={e => setModifyHoursData({ ...modifyHoursData, reason: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default MentorDashboard; 