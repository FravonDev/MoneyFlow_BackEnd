import { User } from "./IUser";

export interface Income {
    id: string;
    description: string;
    value: number;
    user: User;
}
