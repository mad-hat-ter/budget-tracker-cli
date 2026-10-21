import type { TransactionType } from "./TransactionType.js";

export interface ITransaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: string;
  description: string;
}
