import type { Account } from "../classes/Account.js";
import type { ISummary } from "./ISummary.js";

export interface IAccountManager {
  addAccount(account: Account): void;
  removeAccountById(accountId: string): boolean;
  getAccountById(id: string): Account | undefined;
  getAllAccounts(): Account[];
  getSummary(): ISummary;
}
