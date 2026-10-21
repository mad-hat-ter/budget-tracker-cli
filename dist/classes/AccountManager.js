export class AccountManager {
    accounts = [];
    get income() {
        return this.accounts.reduce((sum, account) => sum + account.income, 0);
    }
    get expenses() {
        return this.accounts.reduce((sum, account) => sum + account.expenses, 0);
    }
    get balance() {
        return this.income - this.expenses;
    }
    addAccount(account) {
        if (this.accounts.some((item) => item.id === account.id)) {
            throw new Error("Счёт с таким ID уже добавлен.");
        }
        this.accounts.push(account);
    }
    removeAccountById(accountId) {
        const index = this.accounts.findIndex((account) => account.id === accountId);
        if (index < 0)
            return false;
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
}
