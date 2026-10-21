import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { formatCurrency } from "../lib/budget-utils.js";
moment.locale("ru");
export class Transaction {
    amount;
    type;
    date;
    description;
    id = uuidv4();
    constructor(amount, type, date, description) {
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.description = description;
    }
    update(update) {
        if (update.amount !== undefined)
            this.amount = update.amount;
        if (update.type !== undefined)
            this.type = update.type;
        if (update.date !== undefined)
            this.date = update.date;
        if (update.description !== undefined)
            this.description = update.description;
    }
    toString() {
        const label = this.type === "income" ? "доход" : "расход";
        const dateLabel = moment(this.date).format("LL");
        return `#${this.id.slice(0, 8)} ${this.description} (${label} ${formatCurrency(this.amount)}) | ${dateLabel}`;
    }
}
