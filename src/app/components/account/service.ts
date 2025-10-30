import { fetcher } from "../../../utils/fetcher";
import { BankAccount } from "./model";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const fetchBankAccounts = async (): Promise<BankAccount[]> => {
    const raw = await fetcher(`${apiBaseUrl}/accounts`);
    return mapToBankAccounts(raw || []);
};

export const fetchBankAccountById = async (accountId: string): Promise<BankAccount> => {
    const raw = await fetcher(`${apiBaseUrl}/accounts/${accountId}`);
    const accounts = mapToBankAccounts([raw]);
    return accounts[0];
};

export const createBankAccount = async (account: BankAccount): Promise<BankAccount> => {
    const raw = await fetcher(`${apiBaseUrl}/accounts`, {
        method: "POST",
        body: JSON.stringify(account),
    });
    return mapToBankAccount(raw);
};

export const withdrawFromAccount = async (accountId: string, amount: number): Promise<BankAccount> => {
    const raw = await fetcher(`${apiBaseUrl}/accounts/${accountId}/withdraw`, {
        method: "POST",
        body: JSON.stringify({ amount }),
    });
    return mapToBankAccount(raw);
};

export const depositToAccount = async (accountId: string, amount: number): Promise<BankAccount> => {
    const raw = await fetcher(`${apiBaseUrl}/accounts/${accountId}/deposit`, {
        method: "POST",
        body: JSON.stringify({ amount }),
    });
    return mapToBankAccount(raw);
};

export const transferBetweenAccounts = async (
    fromAccountId: string,
    toAccountId: string,
    amount: number
): boolean => {
    const raw = await fetcher(`${apiBaseUrl}/accounts/transfer`, {
        method: "POST",
        body: JSON.stringify({ fromAccountId, toAccountId, amount }),
    });
    return true;
};

function mapToBankAccounts(data: any): BankAccount[] {
    if (!Array.isArray(data)) {
        throw new Error("Invalid API response");
    }

    return data.map((item) => {
        if (typeof item !== "object" || item === null) {
            throw new Error("Invalid API response");
        }
        return mapToBankAccount(item);
    });
}   

function mapToBankAccount(data: any): BankAccount {
    if (typeof data !== "object" || data === null) {
        throw new Error("Invalid API response");
    }

    const { accountId, accountHolder, balance, active } = data as any;

    return {
        accountId,
        accountHolder,
        balance,
        active,
    };
}   