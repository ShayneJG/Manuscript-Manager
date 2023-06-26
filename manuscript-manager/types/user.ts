export default  interface UserType {
    name: string;
    image?: string;
    email: string;
    payRate: number;
    earnings?: UserEarnings;
}

interface UserEarnings {
    weekly: number;
    monthly: number;
}