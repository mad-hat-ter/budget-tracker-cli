import type { IAccount } from "./IAccount.js";
import type { ITransaction } from "./ITransaction.js";
import type { Transaction } from "../classes/Transaction.js";

export type TransactionUpdate = Partial<Omit<ITransaction, "id">>;
export type AccountUpdate = Partial<Omit<IAccount, "id" | "transactions">>;

export type CompleteTransaction = Required<ITransaction>;
export type TransactionWithoutDescription = Omit<ITransaction, "description">;
export type TransactionPreview = Pick<
  ITransaction,
  "id" | "amount" | "type" | "date"
>;
export type AccountInfo = Pick<IAccount, "id" | "name">;
export type CategoryLimits = Record<"income" | "expense", number>;
export type TransactionConstructorParams = ConstructorParameters<
  typeof Transaction
>;
export type TransactionInstance = InstanceType<typeof Transaction>;
export type NullableDescription = Omit<ITransaction, "description"> & {
  description: string | null;
};
