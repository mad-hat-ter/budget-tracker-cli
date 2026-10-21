"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountManager = exports.Account = exports.Transaction = void 0;
class Transaction {
    constructor(id, amount, type, date, description) {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.description = description;
    }
    toString() {
        const typeLabel = this.type === "income" ? "доход" : "расход";
        const dateLabel = new Date(this.date).toLocaleDateString("ru-RU");
        return `Транзакция #${this.id}: ${this.description} (${typeLabel} ${this.amount} ₽) | ${dateLabel}`;
    }
}
exports.Transaction = Transaction;
class Account {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.transactions = [];
    }
    get income() {
        return this.transactions
            .filter((transaction) => transaction.type === "income")
            .reduce((total, transaction) => total + transaction.amount, 0);
    }
    get expenses() {
        return this.transactions
            .filter((transaction) => transaction.type === "expense")
            .reduce((total, transaction) => total + transaction.amount, 0);
    }
    get balance() {
        return this.income - this.expenses;
    }
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }
    removeTransactionById(transactionId) {
        const index = this.transactions.findIndex((transaction) => transaction.id === transactionId);
        if (index === -1) {
            return false;
        }
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
        return `${this.name}: баланс ${this.balance} ₽, транзакций: ${this.transactions.length}`;
    }
    toString() {
        const transactionList = this.transactions.length
            ? this.transactions
                .map((transaction, index) => `${index + 1}) ${transaction.toString()}`)
                .join("\n")
            : "Транзакций пока нет.";
        return `${this.name}\n${transactionList}\nБаланс: ${this.balance} ₽`;
    }
}
exports.Account = Account;
class AccountManager {
    constructor() {
        this.accounts = [];
    }
    get income() {
        return this.accounts.reduce((total, account) => total + account.income, 0);
    }
    get expenses() {
        return this.accounts.reduce((total, account) => total + account.expenses, 0);
    }
    get balance() {
        return this.income - this.expenses;
    }
    addAccount(account) {
        this.accounts.push(account);
    }
    removeAccountById(accountId) {
        const index = this.accounts.findIndex((account) => account.id === accountId);
        if (index === -1) {
            return false;
        }
        this.accounts.splice(index, 1);
        return true;
    }
    getAccountById(id) {
        return this.accounts.find((account) => account.id === id);
    }
    getAllAccounts() {
        return [...this.accounts];
    }
    getSummary() {
        return {
            income: this.income,
            expenses: this.expenses,
            balance: this.balance,
        };
    }
    getSummaryString() {
        if (this.accounts.length === 0) {
            return "Счетов пока нет.";
        }
        return this.accounts
            .map((account) => account.getSummaryString())
            .join("\n");
    }
    toString() {
        return [
            "Все бюджеты:",
            this.getSummaryString(),
            `Общий доход: ${this.income} ₽`,
            `Общие расходы: ${this.expenses} ₽`,
            `Общий баланс: ${this.balance} ₽`,
        ].join("\n");
    }
}
exports.AccountManager = AccountManager;
