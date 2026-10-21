import { v4 as uuidv4 } from "uuid";
import { writeFile } from "node:fs/promises";
import { formatCurrency } from "../lib/budget-utils.js";
import { escapeCsvValue } from "../utils/escapeCsvValue.js";
import { Transaction } from "./Transaction.js";
export class Account {
    name;
    id = uuidv4();
    transactions = [];
    constructor(name) {
        this.name = name;
    }
    get income() {
        return this.transactions
            .filter((transaction) => transaction.type === "income")
            .reduce((sum, transaction) => sum + transaction.amount, 0);
    }
    get expenses() {
        return this.transactions
            .filter((transaction) => transaction.type === "expense")
            .reduce((sum, transaction) => sum + transaction.amount, 0);
    }
    get balance() {
        return this.income - this.expenses;
    }
    update(update) {
        if (update.name !== undefined)
            this.name = update.name;
    }
    addTransaction(transaction) {
        if (transaction instanceof Transaction) {
            this.transactions.push(transaction);
            return;
        }
        const copy = new Transaction(transaction.amount, transaction.type, transaction.date, transaction.description);
        Object.defineProperty(copy, "id", {
            value: transaction.id,
            enumerable: true,
            writable: false,
        });
        this.transactions.push(copy);
    }
    removeTransactionById(transactionId) {
        const index = this.transactions.findIndex((item) => item.id === transactionId);
        if (index < 0)
            return false;
        this.transactions.splice(index, 1);
        return true;
    }
    getTransactions() {
        return [...this.transactions];
    }
    getSummary() {
        return {
            income: this.income,
            expenses: this.expenses,
            balance: this.balance,
        };
    }
    getSummaryString() {
        return `${this.name} | доход: ${formatCurrency(this.income)} | расходы: ${formatCurrency(this.expenses)} | баланс: ${formatCurrency(this.balance)} | транзакций: ${this.transactions.length}`;
    }
    toString() {
        const rows = this.transactions.length
            ? this.transactions
                .map((transaction, index) => `${index + 1}. ${transaction}`)
                .join("\n")
            : "Транзакций пока нет.";
        return `${this.getSummaryString()}\n${rows}`;
    }
    async exportTransactionsToCSV(filename) {
        const header = "id,amount,type,date,description";
        const rows = this.transactions.map((transaction) => [
            transaction.id,
            transaction.amount,
            transaction.type,
            transaction.date,
            transaction.description,
        ]
            .map(escapeCsvValue)
            .join(","));
        const csv = [header, ...rows].join("\n");
        try {
            await writeFile(filename, `${csv}\n`, "utf8");
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "неизвестная ошибка";
            throw new Error(`Не удалось записать файл «${filename}»: ${message}`);
        }
    }
}
