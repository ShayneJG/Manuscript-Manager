export default  interface UserType {
    name: string;
    image?: string;
    email: string;
    payRate: number;
    earnings?: UserEarnings;
}

interface UserEarnings {
    workDays: number;
    monthly: number;
}