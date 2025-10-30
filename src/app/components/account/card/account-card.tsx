import React, { useState } from 'react';
import { BankAccount } from '../model';
import { useWithdrawFromAccount, useDepositToAccount } from '../hook';

interface AccountCardProps {
  account: BankAccount;
  onAccountClick: (accountId: string) => void;
  onPrefetch: (accountId: string) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onAccountClick, onPrefetch }) => {
  const [amount, setAmount] = useState<string>('');
  const withdrawMutation = useWithdrawFromAccount();
  const depositMutation = useDepositToAccount();

  const handleWithdraw = (e: React.MouseEvent) => {
    e.stopPropagation();
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0 && withdrawAmount <= account.balance) {
      withdrawMutation.mutate({ 
        accountId: account.accountId, 
        amount: withdrawAmount 
      });
      setAmount('');
    }
  };

  const handleDeposit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      depositMutation.mutate({ 
        accountId: account.accountId, 
        amount: depositAmount 
      });
      setAmount('');
    }
  };

  const isTransactionLoading = withdrawMutation.isPending || depositMutation.isPending;

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-md border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
        account.active 
          ? 'border-green-200 hover:border-green-300' 
          : 'border-gray-200 opacity-75'
      }`}
      onClick={() => onAccountClick(account.accountId)}
      onMouseEnter={() => onPrefetch(account.accountId)}
    >
      {isTransactionLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
          <div className="text-blue-600 font-medium">Processing...</div>
        </div>
      )}
      
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{account.accountHolder}</h3>
          <p className="text-sm text-gray-500 mb-2">Account ID: {account.accountId}</p>
          <p className={`text-xl font-bold mb-2 ${
            account.balance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Balance: ${account.balance.toFixed(2)}
          </p>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            account.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {account.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {account.active && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-lg">
          <div className="space-y-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleWithdraw}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > account.balance || isTransactionLoading}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Withdraw
              </button>
              <button
                onClick={handleDeposit}
                disabled={!amount || parseFloat(amount) <= 0 || isTransactionLoading}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};