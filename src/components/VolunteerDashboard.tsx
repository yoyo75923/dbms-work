import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../contexts/AuthContext';

interface AttendanceRecord {
    attendance_id: number;
    event_name: string;
    event_date: string;
    hours_given: number;
    attendance_status: string;
    marked_by_name: string;
}

const VolunteerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [eventsAttended, setEventsAttended] = useState(0);

    useEffect(() => {
        fetchAttendanceHistory();
        fetchVolunteerStats();
    }, []);

    const fetchAttendanceHistory = async () => {
        try {
            const response = await fetch(`/api/attendance/history/${user.volunteerId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setAttendanceHistory(data);
        } catch (error) {
            console.error('Failed to fetch attendance history:', error);
        }
    };

    const fetchVolunteerStats = async () => {
        try {
            const response = await fetch(`/api/volunteers/${user.volunteerId}/stats`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setTotalHours(data.total_hours);
            setEventsAttended(data.events_attended);
        } catch (error) {
            console.error('Failed to fetch volunteer stats:', error);
        }
    };

    const columns: ColumnsType<AttendanceRecord> = [
        {
            title: 'Event Name',
            dataIndex: 'event_name',
            key: 'event_name',
        },
        {
            title: 'Date',
            dataIndex: 'event_date',
            key: 'event_date',
            render: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Hours',
            dataIndex: 'hours_given',
            key: 'hours_given',
        },
        {
            title: 'Status',
            dataIndex: 'attendance_status',
            key: 'attendance_status',
            render: (status: string) => (
                <span className={status === 'present' ? 'text-green-600' : 'text-red-600'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            )
        },
        {
            title: 'Marked By',
            dataIndex: 'marked_by_name',
            key: 'marked_by_name',
        }
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Volunteer Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                    <Statistic
                        title="Total Hours"
                        value={totalHours}
                        suffix="hrs"
                    />
                </Card>
                <Card>
                    <Statistic
                        title="Events Attended"
                        value={eventsAttended}
                        suffix="events"
                    />
                </Card>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
                <Table
                    columns={columns}
                    dataSource={attendanceHistory}
                    rowKey="attendance_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} records`
                    }}
                />
            </div>
        </div>
    );
};

export default VolunteerDashboard; 