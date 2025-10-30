import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BankAccount } from './model';
import {
  fetchBankAccounts,
  fetchBankAccountById,
  createBankAccount,
  withdrawFromAccount,
  depositToAccount,
  transferBetweenAccounts,
} from './service';

// Query keys for cache management
export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (filters: string) => [...accountKeys.lists(), { filters }] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
};

// Hook to fetch all bank accounts
export const useBankAccounts = () => {
  return useQuery({
    queryKey: accountKeys.lists(),
    queryFn: fetchBankAccounts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to fetch a specific bank account by ID
export const useBankAccount = (accountId: string) => {
  return useQuery({
    queryKey: accountKeys.detail(accountId),
    queryFn: () => fetchBankAccountById(accountId),
    enabled: !!accountId, // Only run if accountId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to create a new bank account
export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBankAccount,
    onSuccess: (newAccount) => {
      // Invalidate and refetch accounts list
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      
      // Optimistically update the cache with the new account
      queryClient.setQueryData(accountKeys.detail(newAccount.accountId), newAccount);
    },
    onError: (error) => {
      console.error('Failed to create bank account:', error);
    },
  });
};

// Hook to withdraw from an account
export const useWithdrawFromAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, amount }: { accountId: string; amount: number }) =>
      withdrawFromAccount(accountId, amount),
    onSuccess: (updatedAccount, { accountId }) => {
      // Update the specific account in cache
      queryClient.setQueryData(accountKeys.detail(accountId), updatedAccount);
      
      // Invalidate accounts list to ensure consistency
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to withdraw from account:', error);
    },
  });
};

// Hook to deposit to an account
export const useDepositToAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, amount }: { accountId: string; amount: number }) =>
      depositToAccount(accountId, amount),
    onSuccess: (updatedAccount, { accountId }) => {
      // Update the specific account in cache
      queryClient.setQueryData(accountKeys.detail(accountId), updatedAccount);
      
      // Invalidate accounts list to ensure consistency
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to deposit to account:', error);
    },
  });
};

// Hook to transfer between accounts
export const useTransferBetweenAccounts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fromAccountId,
      toAccountId,
      amount,
    }: {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
    }) => transferBetweenAccounts(fromAccountId, toAccountId, amount),
    onSuccess: (success, { fromAccountId, toAccountId }) => {
      if (success) {
        // Invalidate both affected accounts
        queryClient.invalidateQueries({ queryKey: accountKeys.detail(fromAccountId) });
        queryClient.invalidateQueries({ queryKey: accountKeys.detail(toAccountId) });
        
        // Invalidate accounts list to ensure consistency
        queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      }
    },
    onError: (error) => {
      console.error('Failed to transfer between accounts:', error);
    },
  });
};
