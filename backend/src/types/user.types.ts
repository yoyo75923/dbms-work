export enum UserRole {
    VOLUNTEER = 'volunteer',
    MENTOR = 'mentor',
    GEN_SEC = 'gen_sec'
}

export interface User {
    userId: number;
    email: string;
    name: string;
    role: UserRole;
    rollNumber: string;
    wingName?: string;
}

export interface Volunteer extends User {
    volunteerId: number;
    mentorId: number;
    totalHours: number;
    eventsAttended: number;
}

export interface Mentor extends User {
    mentorId: number;
    menteeCount: number;
}

export interface GeneralSecretary extends User {
    gensecId: number;
} 