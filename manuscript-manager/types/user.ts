export default  interface UserType {
    name: string;
    image?: string;
    email: string;
    payRate: number;
    earnings?: UserEarnings;
}

export interface  UserEarnings {
    workDays: number;
    monthly: number;
}