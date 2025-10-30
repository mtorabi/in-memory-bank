import React, { useState } from 'react';
import { 
  useBankAccounts 
} from '../hook';
import { AccountCard } from '../card/account-card';
import CreateAccountForm from '../form/create-account-form';
import TransferMoneyForm from '../form/transfer-money-form';

const BankAccountsList: React.FC = () => {
  const { data: accounts, isLoading, error, refetch } = useBankAccounts();

  const handleAccountClick = (accountId: string) => {
    console.log(`Navigate to account details: ${accountId}`);
    // Here you would typically navigate to account details page
    // e.g., router.push(`/accounts/${accountId}`)
  };

  const handlePrefetch = (accountId: string) => {
    // Placeholder for prefetch functionality
    console.log(`Prefetch account: ${accountId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">
          Loading bank accounts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <div className="text-red-700 mb-4">
          Error loading accounts: {error.message}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const activeAccounts = accounts?.filter(account => account.active) || [];
  const inactiveAccounts = accounts?.filter(account => !account.active) || [];
  const totalBalance = activeAccounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Bank Accounts</h1>
        <div className="text-sm text-gray-600 space-x-4">
          <span>Total Accounts: {accounts?.length || 0}</span>
          <span>Active: {activeAccounts.length}</span>
          <span>Total Balance: <span className="font-semibold text-green-600">
            ${totalBalance.toFixed(2)}
          </span></span>
        </div>
      </div>

      <CreateAccountForm />

      <TransferMoneyForm />

      {accounts && accounts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No bank accounts found. Create your first account above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeAccounts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeAccounts.map((account) => (
                  <AccountCard
                    key={account.accountId}
                    account={account}
                    onAccountClick={handleAccountClick}
                    onPrefetch={handlePrefetch}
                  />
                ))}
              </div>
            </div>
          )}

          {inactiveAccounts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-500 mb-4">Inactive Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveAccounts.map((account) => (
                  <AccountCard
                    key={account.accountId}
                    account={account}
                    onAccountClick={handleAccountClick}
                    onPrefetch={handlePrefetch}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BankAccountsList;
