import type { IAccountManager } from "../interfaces/IAccountManager.js";
import type { ISummary } from "../interfaces/ISummary.js";
import { Account } from "./Account.js";

export class AccountManager implements IAccountManager, ISummary {
  public readonly accounts: Account[] = [];

  get income(): number {
    return this.accounts.reduce((sum, account) => sum + account.income, 0);
  }

  get expenses(): number {
    return this.accounts.reduce((sum, account) => sum + account.expenses, 0);
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  addAccount(account: Account): void {
    if (this.accounts.some((item) => item.id === account.id)) {
      throw new Error("Счёт с таким ID уже добавлен.");
    }
    this.accounts.push(account);
  }

  removeAccountById(accountId: string): boolean {
    const index = this.accounts.findIndex(
      (account) => account.id === accountId,
    );
    if (index < 0) return false;
    this.accounts.splice(index, 1);
    return true;
  }

  getAccountById(id: string): Account | undefined {
    return this.accounts.find((account) => account.id === id);
  }

  getAllAccounts(): Account[] {
    return [...this.accounts];
  }

  getSummary(): ISummary {
    return {
      income: this.income,
      expenses: this.expenses,
      balance: this.balance,
    };
  }
}
