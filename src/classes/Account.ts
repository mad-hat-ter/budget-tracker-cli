import { v4 as uuidv4 } from "uuid";
import { writeFile } from "node:fs/promises";
import { formatCurrency } from "../lib/budget-utils.js";
import { escapeCsvValue } from "../utils/escapeCsvValue.js";
import type { IAccount } from "../interfaces/IAccount.js";
import type { ITransaction } from "../interfaces/ITransaction.js";
import type { ISummary } from "../interfaces/ISummary.js";
import type { AccountUpdate } from "../interfaces/utility-types.js";
import { Transaction } from "./Transaction.js";

export class Account implements IAccount, ISummary {
  public readonly id: string = uuidv4();
  public readonly transactions: Transaction[] = [];

  constructor(public name: string) {}

  get income(): number {
    return this.transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  get expenses(): number {
    return this.transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  update(update: AccountUpdate): void {
    if (update.name !== undefined) this.name = update.name;
  }

  addTransaction(transaction: ITransaction): void {
    if (transaction instanceof Transaction) {
      this.transactions.push(transaction);
      return;
    }

    const copy = new Transaction(
      transaction.amount,
      transaction.type,
      transaction.date,
      transaction.description,
    );
    Object.defineProperty(copy, "id", {
      value: transaction.id,
      enumerable: true,
      writable: false,
    });
    this.transactions.push(copy);
  }

  removeTransactionById(transactionId: string): boolean {
    const index = this.transactions.findIndex(
      (item) => item.id === transactionId,
    );
    if (index < 0) return false;
    this.transactions.splice(index, 1);
    return true;
  }

  getTransactions(): ITransaction[] {
    return [...this.transactions];
  }

  getSummary(): ISummary {
    return {
      income: this.income,
      expenses: this.expenses,
      balance: this.balance,
    };
  }

  getSummaryString(): string {
    return `${this.name} | доход: ${formatCurrency(this.income)} | расходы: ${formatCurrency(this.expenses)} | баланс: ${formatCurrency(this.balance)} | транзакций: ${this.transactions.length}`;
  }

  toString(): string {
    const rows = this.transactions.length
      ? this.transactions
          .map((transaction, index) => `${index + 1}. ${transaction}`)
          .join("\n")
      : "Транзакций пока нет";
    return `${this.getSummaryString()}\n${rows}`;
  }

  async exportTransactionsToCSV(filename: string): Promise<void> {
    const header = "id,amount,type,date,description";
    const rows = this.transactions.map((transaction) =>
      [
        transaction.id,
        transaction.amount,
        transaction.type,
        transaction.date,
        transaction.description,
      ]
        .map(escapeCsvValue)
        .join(","),
    );
    const csv = [header, ...rows].join("\n");

    try {
      await writeFile(filename, `${csv}\n`, "utf8");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "неизвестная ошибка";
      throw new Error(`Не удалось записать файл «${filename}»: ${message}`);
    }
  }
}
