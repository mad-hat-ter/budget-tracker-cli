import inquirer from "inquirer";
import { Account } from "./Account.js";
import { AccountManager } from "./AccountManager.js";
import { Transaction } from "./Transaction.js";
const BACK = "← Назад";
const EXIT = "Выход";
export class ApplicationController {
    accountManager = new AccountManager();
    async start() {
        let running = true;
        while (running) {
            console.clear();
            const accounts = this.accountManager.getAllAccounts();
            const choices = [
                ...accounts.map((account) => ({
                    name: account.getSummaryString(),
                    value: account.id,
                })),
                new inquirer.Separator(),
                { name: "＋ Создать счёт", value: "create" },
                { name: "Выход", value: EXIT },
            ];
            const answer = await inquirer.prompt([
                {
                    type: "list",
                    name: "action",
                    message: "Выберите счёт или действие:",
                    choices,
                },
            ]);
            if (answer.action === EXIT) {
                running = false;
            }
            else if (answer.action === "create") {
                await this.createAccount();
            }
            else {
                await this.watchAccount(answer.action);
            }
        }
        console.clear();
        console.log("До встречи!");
    }
    async createAccount() {
        console.clear();
        const answer = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Название нового счёта:",
                validate: (value) => value.trim().length > 0 || "Название не должно быть пустым.",
                filter: (value) => value.trim(),
            },
        ]);
        this.accountManager.addAccount(new Account(answer.name));
        console.log(`Счёт «${answer.name}» создан.`);
        await this.pause();
    }
    async watchAccount(accountId) {
        let viewing = true;
        while (viewing) {
            const account = this.accountManager.getAccountById(accountId);
            if (!account)
                return;
            console.clear();
            console.log(account.toString());
            const answer = await inquirer.prompt([
                {
                    type: "list",
                    name: "action",
                    message: "Действия со счётом:",
                    choices: [
                        { name: "Добавить транзакцию", value: "add" },
                        { name: "Удалить транзакцию", value: "removeTransaction" },
                        { name: "Экспортировать транзакции в CSV", value: "export" },
                        { name: "Удалить счёт", value: "removeAccount" },
                        { name: "← К списку счетов", value: BACK },
                    ],
                },
            ]);
            switch (answer.action) {
                case "add":
                    await this.addTransaction(accountId);
                    break;
                case "removeTransaction":
                    await this.removeTransaction(accountId);
                    break;
                case "export":
                    await this.exportTransactionsToCSV(accountId);
                    break;
                case "removeAccount":
                    viewing = !(await this.removeAccount(accountId));
                    break;
                default:
                    viewing = false;
            }
        }
    }
    async addTransaction(accountId) {
        const account = this.accountManager.getAccountById(accountId);
        if (!account)
            return;
        console.clear();
        const today = new Date().toISOString().slice(0, 10);
        const answer = await inquirer.prompt([
            {
                type: "number",
                name: "amount",
                message: "Сумма:",
                min: 0.01,
                validate: (value) => (Number.isFinite(value) && value > 0) || "Введите сумму больше нуля.",
            },
            {
                type: "list",
                name: "type",
                message: "Тип транзакции:",
                choices: [
                    { name: "Доход", value: "income" },
                    { name: "Расход", value: "expense" },
                ],
            },
            {
                type: "input",
                name: "date",
                message: "Дата (ГГГГ-ММ-ДД):",
                default: today,
                validate: (value) => this.isValidDate(value) ||
                    "Укажите корректную дату в формате ГГГГ-ММ-ДД.",
            },
            {
                type: "input",
                name: "description",
                message: "Описание:",
                validate: (value) => value.trim().length > 0 || "Описание не должно быть пустым.",
                filter: (value) => value.trim(),
            },
        ]);
        account.addTransaction(new Transaction(answer.amount, answer.type, `${answer.date}T00:00:00.000Z`, answer.description));
        console.log("Транзакция добавлена.");
        await this.pause();
    }
    async removeTransaction(accountId) {
        const account = this.accountManager.getAccountById(accountId);
        if (!account)
            return;
        const transactions = account.getTransactions();
        if (transactions.length === 0) {
            console.log("В этом счёте нет транзакций для удаления.");
            await this.pause();
            return;
        }
        const answer = await inquirer.prompt([
            {
                type: "list",
                name: "transactionId",
                message: "Выберите транзакцию:",
                choices: [
                    ...transactions.map((transaction) => ({
                        name: transaction.toString(),
                        value: transaction.id,
                    })),
                    { name: BACK, value: BACK },
                ],
            },
        ]);
        if (answer.transactionId === BACK)
            return;
        const confirmation = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirmed",
                message: "Удалить выбранную транзакцию?",
                default: false,
            },
        ]);
        if (confirmation.confirmed) {
            const removed = account.removeTransactionById(answer.transactionId);
            console.log(removed ? "Транзакция удалена." : "Транзакция не найдена.");
        }
        else {
            console.log("Удаление отменено.");
        }
        await this.pause();
    }
    async removeAccount(accountId) {
        const account = this.accountManager.getAccountById(accountId);
        if (!account)
            return true;
        const answer = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirmed",
                message: `Удалить счёт «${account.name}» и все его транзакции?`,
                default: false,
            },
        ]);
        if (!answer.confirmed) {
            console.log("Удаление отменено.");
            await this.pause();
            return false;
        }
        this.accountManager.removeAccountById(accountId);
        console.log("Счёт и связанные транзакции удалены.");
        await this.pause();
        return true;
    }
    async exportTransactionsToCSV(accountId) {
        const account = this.accountManager.getAccountById(accountId);
        if (!account)
            return;
        const answer = await inquirer.prompt([
            {
                type: "input",
                name: "filename",
                message: "Имя CSV-файла без расширения:",
                default: "transactions",
                validate: (value) => {
                    const trimmed = value.trim();
                    return ((trimmed.length > 0 && !/[<>:"/\\|?*]/.test(trimmed)) ||
                        "Введите допустимое имя файла.");
                },
                filter: (value) => value.trim().replace(/\.csv$/i, ""),
            },
        ]);
        try {
            await account.exportTransactionsToCSV(`${answer.filename}.csv`);
            console.log(`Экспорт завершён: ${answer.filename}.csv`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Неизвестная ошибка";
            console.error(`Ошибка экспорта: ${message}`);
        }
        await this.pause();
    }
    isValidDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
            return false;
        const date = new Date(`${value}T00:00:00.000Z`);
        return (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value);
    }
    async pause() {
        await inquirer.prompt([
            {
                type: "input",
                name: "continue",
                message: "Нажмите Enter, чтобы продолжить",
            },
        ]);
    }
}
