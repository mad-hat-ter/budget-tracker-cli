import type { ITransaction } from "./ITransaction.js";

export type TransactionFieldType<TField> = TField extends keyof ITransaction
  ? ITransaction[TField]
  : never;

export type OptionalTransaction<TFields extends keyof ITransaction> = Omit<
  ITransaction,
  TFields
> &
  Partial<Pick<ITransaction, TFields>>;

export type ReadonlyTransactionFields<TFields extends keyof ITransaction> =
  Omit<ITransaction, TFields> & Readonly<Pick<ITransaction, TFields>>;

export type IsIncome<T> = T extends { type: "income" } ? true : false;
