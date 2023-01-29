import { Income } from "./IIncome";
import { Outcome } from "./IOutcome";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string,
    balance: number,
    Incomes?: Income[]
    Outcomes?: Outcome[]
    }