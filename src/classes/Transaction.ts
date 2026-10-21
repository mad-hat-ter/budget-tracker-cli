import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { formatCurrency } from "../lib/budget-utils.js";
import type { ITransaction } from "../interfaces/ITransaction.js";
import type { TransactionType } from "../interfaces/TransactionType.js";
import type { TransactionUpdate } from "../interfaces/utility-types.js";

moment.locale("ru");

export class Transaction implements ITransaction {
  public readonly id: string = uuidv4();

  constructor(
    public amount: number,
    public type: TransactionType,
    public date: string,
    public description: string,
  ) {}

  update(update: TransactionUpdate): void {
    if (update.amount !== undefined) this.amount = update.amount;
    if (update.type !== undefined) this.type = update.type;
    if (update.date !== undefined) this.date = update.date;
    if (update.description !== undefined) this.description = update.description;
  }

  toString(): string {
    const label = this.type === "income" ? "доход" : "расход";
    const dateLabel = moment(this.date).format("LL");
    return `#${this.id.slice(0, 8)} ${this.description} (${label} ${formatCurrency(this.amount)}) | ${dateLabel}`;
  }
}
