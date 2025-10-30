import React, { useState } from 'react';
import { useBankAccounts, useTransferBetweenAccounts } from '../hook';

const TransferMoneyForm: React.FC = () => {
  const [transferData, setTransferData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: 0
  });
  const [showForm, setShowForm] = useState(false);
  
  const { data: accounts = [], isLoading } = useBankAccounts();
  const transferMutation = useTransferBetweenAccounts();

  const activeAccounts = accounts.filter(account => account.active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (transferData.fromAccountId && transferData.toAccountId && transferData.amount > 0) {
      if (transferData.fromAccountId === transferData.toAccountId) {
        alert('Cannot transfer to the same account');
        return;
      }

      transferMutation.mutate({
        fromAccountId: transferData.fromAccountId,
        toAccountId: transferData.toAccountId,
        amount: transferData.amount
      }, {
        onSuccess: () => {
          setTransferData({ fromAccountId: '', toAccountId: '', amount: 0 });
          setShowForm(false);
        }
      });
    }
  };

  const getFromAccountBalance = () => {
    const fromAccount = activeAccounts.find(acc => acc.accountId === transferData.fromAccountId);
    return fromAccount ? fromAccount.balance : 0;
  };

  const getAccountDisplayName = (account: any) => {
    return `${account.accountHolder} (${account.accountId}) - $${account.balance.toFixed(2)}`;
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
      >
        💸 Transfer Money
      </button>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <p className="text-gray-600">Loading accounts...</p>
      </div>
    );
  }

  if (activeAccounts.length < 2) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Transfer Money</h3>
        <p className="text-gray-600 mb-4">
          You need at least 2 active accounts to transfer money.
        </p>
        <button
          onClick={() => setShowForm(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Transfer Money</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="from-account-select">
              From Account:
            </label>
            <select
              id="from-account-select"
              value={transferData.fromAccountId}
              onChange={(e) => setTransferData({ ...transferData, fromAccountId: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select source account</option>
              {activeAccounts.map(account => (
                <option key={account.accountId} value={account.accountId}>
                  {getAccountDisplayName(account)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="to-account-select">
              To Account:
            </label>
            <select
              id="to-account-select"
              value={transferData.toAccountId}
              onChange={(e) => setTransferData({ ...transferData, toAccountId: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select destination account</option>
              {activeAccounts
                .filter(account => account.accountId !== transferData.fromAccountId)
                .map(account => (
                  <option key={account.accountId} value={account.accountId}>
                    {getAccountDisplayName(account)}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="amount-input">
            Transfer Amount:
          </label>
          <input
            id="amount-input"
            type="number"
            value={transferData.amount || ''}
            onChange={(e) => setTransferData({ ...transferData, amount: parseFloat(e.target.value) || 0 })}
            min="0.01"
            max={getFromAccountBalance()}
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="0.00"
          />
          {transferData.fromAccountId && (
            <p className="text-sm text-gray-600 mt-1">
              Available balance: ${getFromAccountBalance().toFixed(2)}
            </p>
          )}
        </div>

        {transferData.fromAccountId && transferData.toAccountId && transferData.amount > 0 && (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Transfer Summary:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <span className="font-medium">From:</span> {activeAccounts.find(acc => acc.accountId === transferData.fromAccountId)?.accountHolder} 
                ({transferData.fromAccountId})
              </p>
              <p>
                <span className="font-medium">To:</span> {activeAccounts.find(acc => acc.accountId === transferData.toAccountId)?.accountHolder} 
                ({transferData.toAccountId})
              </p>
              <p>
                <span className="font-medium">Amount:</span> ${transferData.amount.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={transferMutation.isPending || transferData.amount > getFromAccountBalance()}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {transferMutation.isPending ? 'Transferring...' : 'Transfer Money'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>

        {transferMutation.error && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
            Error: {transferMutation.error.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default TransferMoneyForm;