interface Transaction {
  amount: number;
  problemId: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

interface Wallet {
  address: string;
  privateKey: string;
  balance: number;
  transactions: Transaction[];
}
interface User {
  _id?: string;
  clerkId: string;
  email: string;
  streak?: Date[];
  wallet: Wallet;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { User, Wallet, Transaction };
