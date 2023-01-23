import { User } from "./IUser";

export interface Outcome {
    id: number;
    value: number;
    description: string;
    user: User;
  }